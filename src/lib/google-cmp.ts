/** Privacy & Messaging API; no inferred geography or TCF-purpose mapping. */
export const CMP_CHANGED = "nem:cmp-changed";
export type CmpState = { source: "pending" | "google" | "local"; analytics: boolean };
type GoogleFc = {
  callbackQueue: { push: (entry: Record<string, () => void>) => unknown };
  getGoogleConsentModeValues?: () => { analyticsStoragePurposeConsentStatus: number };
  showRevocationMessage?: () => void;
};
type CmpWindow = Window & {
  googlefc?: GoogleFc;
  __nemCmp?: CmpState;
  __nemCmpStarted?: boolean;
  __tcfapi?: (command: string, version: number, callback: (data: { eventStatus?: string }, success: boolean) => void) => void;
};
export function getCmpState(): CmpState {
  return (window as CmpWindow).__nemCmp ?? { source: "pending", analytics: false };
}
export function startGoogleCmp(): void {
  const browser = window as CmpWindow;
  if (browser.__nemCmpStarted) return;
  browser.__nemCmpStarted = true;
  const fc: GoogleFc = browser.googlefc || { callbackQueue: new Array<Record<string, () => void>>() };
  browser.googlefc = fc;
  fc.callbackQueue = fc.callbackQueue || new Array<Record<string, () => void>>();
  const refresh = () => {
    const value = fc.getGoogleConsentModeValues?.().analyticsStoragePurposeConsentStatus;
    // Official enum: UNKNOWN=0, GRANTED=1, DENIED=2, NOT_APPLICABLE=3,
    // NOT_CONFIGURED=4. Missing configuration is never treated as permission.
    browser.__nemCmp = { source: value === 3 ? "local" : value === 1 || value === 2 ? "google" : "pending", analytics: value === 1 };
    window.dispatchEvent(new Event(CMP_CHANGED));
  };
  fc.callbackQueue.push({ CONSENT_MODE_DATA_READY: refresh });
  fc.callbackQueue.push({ CONSENT_API_READY: () => {
    browser.__tcfapi?.("addEventListener", 0, (data, success) => {
      if (success && (data.eventStatus === "useractioncomplete" || data.eventStatus === "tcloaded")) {
        // Read via the supported queue after the CMP has processed the TCF event.
        setTimeout(() => fc.callbackQueue.push({ CONSENT_MODE_DATA_READY: refresh }), 0);
      }
    });
  } });
}
export function reopenGoogleCmp(): void {
  const fc = (window as CmpWindow).googlefc;
  fc?.callbackQueue.push({ CONSENT_API_READY: () => fc.showRevocationMessage?.() });
}
