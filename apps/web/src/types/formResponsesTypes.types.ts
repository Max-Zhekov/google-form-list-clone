import type { GetFormQuery, ResponsesQuery } from "../gql/generated";

export type FormById = NonNullable<GetFormQuery["form"]>;
export type FormResponseItem = ResponsesQuery["responses"][number];
export type ResponseAnswer = FormResponseItem["answers"][number];

export interface QuestionView {
  id: string;
  title: string;
  type: FormById["questions"][number]["type"];
  options?: string[] | null;
}

export interface AnswerView {
  questionId: string;
  questionTitle: string;
  type: ResponseAnswer["type"];
  value: string;
}

export interface ResponseView {
  id: string;
  createdAt: string;
  answers: AnswerView[];
}
