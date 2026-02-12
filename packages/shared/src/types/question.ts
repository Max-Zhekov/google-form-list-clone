export type QuestionType = "text" | "multiple_choice" | "checkbox" | "date";

export type BaseQuestion = {
  id: string;
  title: string;
  required: boolean;
  order: number;
  type: QuestionType;
};

export type TextQuestion = BaseQuestion & {
  type: "text";
  placeholder?: string;
  maxLength?: number;
};

export type MultipleChoiceQuestion = BaseQuestion & {
  type: "multiple_choice";
  options: string[];
};

export type CheckboxQuestion = BaseQuestion & {
  type: "checkbox";
  options: string[];
  minSelected?: number;
  maxSelected?: number;
};

export type DateQuestion = BaseQuestion & {
  type: "date";
};

export type Question =
  | TextQuestion
  | MultipleChoiceQuestion
  | CheckboxQuestion
  | DateQuestion;
