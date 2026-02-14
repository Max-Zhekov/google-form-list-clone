export type UiQuestionType = "text" | "multiple_choice" | "checkbox" | "date";

export type UiQuestion = {
  id: string;
  type: UiQuestionType;
  title: string;
  required: boolean;
  order: number;

  placeholder?: string;
  maxLength?: string;

  options?: string[];
  minSelected?: string;
  maxSelected?: string;
};
