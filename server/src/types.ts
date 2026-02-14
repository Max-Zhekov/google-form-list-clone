export type GqlQuestionType = "TEXT" | "MULTIPLE_CHOICE" | "CHECKBOX" | "DATE";

export type QuestionInput = {
  type: GqlQuestionType;
  text?: {
    title: string;
    required: boolean;
    order: number;
    placeholder?: string | null;
    maxLength?: number | null;
  } | null;
  multipleChoice?: {
    title: string;
    required: boolean;
    order: number;
    options: string[];
  } | null;
  checkbox?: {
    title: string;
    required: boolean;
    order: number;
    options: string[];
    minSelected?: number | null;
    maxSelected?: number | null;
  } | null;
  date?: {
    title: string;
    required: boolean;
    order: number;
  } | null;
};

export type AnswerInput = {
  questionId: string;
  type: GqlQuestionType;
  textValue?: string | null;
  multipleChoiceValue?: string | null;
  checkboxValue?: string[] | null;
  dateValue?: string | null;
};
