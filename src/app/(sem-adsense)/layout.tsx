import DocumentLayout from "../_document/DocumentLayout";

export { metadata, viewport } from "../_document/DocumentLayout";

export default function OperationalLayout({ children }: { children: React.ReactNode }) {
  return <DocumentLayout>{children}</DocumentLayout>;
}
