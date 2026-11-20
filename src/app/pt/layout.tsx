import DocumentLayout from "../_document/DocumentLayout";

export { metadata, viewport } from "../_document/DocumentLayout";

export default function PublicRouteLayout({ children }: { children: React.ReactNode }) {
  return <DocumentLayout adsense>{children}</DocumentLayout>;
}
