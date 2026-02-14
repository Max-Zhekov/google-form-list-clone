import type {
  GetFormQuery,
  SubmitResponseMutationVariables,
} from "../gql/generated";

export type FormById = NonNullable<GetFormQuery["form"]>;

type AnswersVar = SubmitResponseMutationVariables["answers"];
type ArrayItem<T> = T extends ReadonlyArray<infer U> ? U : T;
export type SubmitAnswer = ArrayItem<AnswersVar>;

export type AnswerState =
  | { type: "TEXT"; value: string }
  | { type: "MULTIPLE_CHOICE"; value: string }
  | { type: "CHECKBOX"; value: string[] }
  | { type: "DATE"; value: string };
