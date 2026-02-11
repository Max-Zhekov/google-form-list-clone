export type Answer =
  | { questionId: string; type: "text"; value: string }
  | { questionId: string; type: "single"; value: string }
  | { questionId: string; type: "multi"; value: string[] };

export type FormResponse = {
  id: string;
  formId: string;
  createdAt: string;
  answers: Answer[];
};
