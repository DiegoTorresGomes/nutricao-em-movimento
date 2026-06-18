export type EditorBlockType =
  | "heading"
  | "paragraph"
  | "unorderedList"
  | "orderedList"
  | "image"
  | "summary"
  | "infoCard"
  | "comparisonCard"
  | "faq"
  | "relatedArticle"
  | "cta"
  | "authorNote"
  | "disclaimer"
  | "references";

export type EditorBlock = {
  id: string;
  type: EditorBlockType;
  data: Record<string, unknown>;
};