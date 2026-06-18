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
  | "exercise"
  | "relatedArticle"
  | "cta"
  | "authorNote"
  | "disclaimer"
  | "references"
  | "table";

export type EditorBlock = {
  id: string;
  type: EditorBlockType;
  data: Record<string, unknown>;
};

export type SummaryBlock = {
  id: string;
  type: "summary";
  data: {
    title: string;
    items: string[];
  };
};

export type ComparisonBlock = {
  id: string;
  type: "comparisonCard";
  data: {
    title?: string;

    leftTitle: string;
    leftItems: string[];

    rightTitle: string;
    rightItems: string[];
  };
};