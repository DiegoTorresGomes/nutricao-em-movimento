/** Local queue only: no Google request. Always precedes optional loaders. */
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
window.gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied',
  ad_personalization: 'denied', analytics_storage: 'denied'
});`;
export function ConsentModeInit() {
  return <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }} />;
}
