export type Answer =
  | { questionId: string; type: "text"; value: string }
  | { questionId: string; type: "multiple_choice"; value: string }
  | { questionId: string; type: "checkbox"; value: string[] }
  | { questionId: string; type: "date"; value: string };

export type FormResponse = {
  id: string;
  formId: string;
  createdAt: string;
  answers: Answer[];
};
