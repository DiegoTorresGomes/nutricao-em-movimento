/**
 * Google CMP observer (Privacy & Messaging API + IAB TCF events only).
 * The Google CMP owns advertising consent. It never grants statistics; while the panel's
 * analytics purpose is enabled it can only restrict them (see analyticsDecision in consent.ts).
 * Nothing here infers geography: a missing CMP simply leaves `api` false.
 */
export const CMP_CHANGED = "nem:cmp-changed";
/** Official googlefc.ConsentModePurposeStatusEnum values. */
export const GOOGLE_STATUS = { UNKNOWN: 0, GRANTED: 1, DENIED: 2, NOT_APPLICABLE: 3, NOT_CONFIGURED: 4 } as const;
export type CmpState = {
  /** CONSENT_API_READY fired: the Google CMP is present on this page. */
  api: boolean;
  /** IAB TCF gdprApplies, as reported by the CMP; undefined until known. */
  gdprApplies?: boolean;
  /** analyticsStoragePurposeConsentStatus from getGoogleConsentModeValues; undefined until read. */
  analytics?: number;
  /** TCF eventStatus "cmpuishown" until "useractioncomplete"/"tcloaded": the Google message is open. */
  uiShown: boolean;
};
type GoogleFc = {
  callbackQueue: { push: (entry: Record<string, () => void>) => unknown };
  getGoogleConsentModeValues?: () => { analyticsStoragePurposeConsentStatus: number };
  showRevocationMessage?: () => void;
};
type TcfData = { eventStatus?: string; gdprApplies?: boolean };
type CmpWindow = Window & {
  googlefc?: GoogleFc;
  __nemCmp?: CmpState;
  __nemCmpStarted?: boolean;
  __tcfapi?: (command: string, version: number, callback: (data: TcfData, success: boolean) => void) => void;
};
export function getCmpState(): CmpState {
  return (window as CmpWindow).__nemCmp ?? { api: false, uiShown: false };
}
function setCmpState(patch: Partial<CmpState>): void {
  const browser = window as CmpWindow;
  browser.__nemCmp = { ...getCmpState(), ...patch };
  window.dispatchEvent(new Event(CMP_CHANGED));
}
export function startGoogleCmp(): void {
  const browser = window as CmpWindow;
  if (browser.__nemCmpStarted) return;
  browser.__nemCmpStarted = true;
  const fc: GoogleFc = browser.googlefc || { callbackQueue: new Array<Record<string, () => void>>() };
  browser.googlefc = fc;
  fc.callbackQueue = fc.callbackQueue || new Array<Record<string, () => void>>();
  const refresh = () => setCmpState({ analytics: fc.getGoogleConsentModeValues?.().analyticsStoragePurposeConsentStatus });
  fc.callbackQueue.push({ CONSENT_MODE_DATA_READY: refresh });
  fc.callbackQueue.push({ CONSENT_API_READY: () => {
    setCmpState({ api: true });
    browser.__tcfapi?.("addEventListener", 2, (data, success) => {
      if (!success) return;
      const done = data.eventStatus === "useractioncomplete" || data.eventStatus === "tcloaded";
      const patch: Partial<CmpState> = {};
      if (typeof data.gdprApplies === "boolean") patch.gdprApplies = data.gdprApplies;
      if (data.eventStatus === "cmpuishown") patch.uiShown = true;
      if (done) patch.uiShown = false;
      setCmpState(patch);
      // Read consent mode values through the supported queue after the CMP processed the choice.
      if (done) setTimeout(() => fc.callbackQueue.push({ CONSENT_MODE_DATA_READY: refresh }), 0);
    });
  } });
}
export function reopenGoogleCmp(): void {
  const fc = (window as CmpWindow).googlefc;
  fc?.callbackQueue.push({ CONSENT_API_READY: () => fc.showRevocationMessage?.() });
}
