export type GqlQuestionType = "TEXT" | "SINGLE" | "MULTI";

export type QuestionInput = {
  type: GqlQuestionType;
  text?: {
    title: string;
    required: boolean;
    order: number;
    placeholder?: string | null;
    maxLength?: number | null;
  } | null;
  single?: {
    title: string;
    required: boolean;
    order: number;
    options: string[];
  } | null;
  multi?: {
    title: string;
    required: boolean;
    order: number;
    options: string[];
    minSelected?: number | null;
    maxSelected?: number | null;
  } | null;
};

export type CreateFormInput = {
  title: string;
  description?: string | null;
  questions: QuestionInput[];
};

export type UpdateFormInput = {
  title?: string | null;
  description?: string | null;
  questions?: QuestionInput[] | null;
};

export type AnswerInput = {
  questionId: string;
  type: GqlQuestionType;
  textValue?: string | null;
  singleValue?: string | null;
  multiValue?: string[] | null;
};

export type SubmitResponseInput = {
  answers: AnswerInput[];
};
