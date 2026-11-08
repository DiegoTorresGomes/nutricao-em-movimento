import { NEWSLETTER_AVAILABLE } from "@/config/newsletter";

// Presentation only: never use this filter in CMS writes, migrations or exports.
// Matches the legacy editor's dedicated, non-nested newsletter promo card.
// All bytes outside that card remain intact, including adjacent editorial text.
export function withoutInactiveNewsletterPromotions(html: string) {
  if (NEWSLETTER_AVAILABLE) return html;
  return html.replace(/<div\b[^>]*>(?:(?!<div\b)[\s\S])*?<\/div>/gi, block => {
    const links = [...block.matchAll(/\bhref=["']([^"']*)["']/gi)];
    const dedicatedHeading = /<h2\b[^>]*>Quer receber mais conteúdos como este\?<\/h2>/i.test(block);
    const onlyNewsletterLinks = links.length === 1 && links[0][1] === "/pt#newsletter";
    return dedicatedHeading && onlyNewsletterLinks && /Inscreva-se na newsletter/i.test(block) ? "" : block;
  });
}
