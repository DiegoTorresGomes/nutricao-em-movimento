import DocumentLayout from "./_document/DocumentLayout";
import NotFound from "./not-found";

export { metadata, viewport } from "./_document/DocumentLayout";

export default function GlobalNotFound() {
  return <DocumentLayout><NotFound /></DocumentLayout>;
}
