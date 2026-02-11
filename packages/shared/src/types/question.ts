export type QuestionType = "text" | "single" | "multi";

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

export type SingleChoiceQuestion = BaseQuestion & {
  type: "single";
  options: string[];
};

export type MultiChoiceQuestion = BaseQuestion & {
  type: "multi";
  options: string[];
  minSelected?: number;
  maxSelected?: number;
};

export type Question =
  | TextQuestion
  | SingleChoiceQuestion
  | MultiChoiceQuestion;
