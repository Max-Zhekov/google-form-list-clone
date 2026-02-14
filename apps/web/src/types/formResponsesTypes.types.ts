import type { GetFormQuery, ResponsesQuery } from "../gql/generated";

export type FormById = NonNullable<GetFormQuery["form"]>;
export type FormResponseItem = ResponsesQuery["responses"][number];
export type ResponseAnswer = FormResponseItem["answers"][number];

export type QuestionView = {
  id: string;
  title: string;
  type: FormById["questions"][number]["type"];
  options?: string[] | null;
};

export type AnswerView = {
  questionId: string;
  questionTitle: string;
  type: ResponseAnswer["type"];
  value: string;
};

export type ResponseView = {
  id: string;
  createdAt: string;
  answers: AnswerView[];
};
