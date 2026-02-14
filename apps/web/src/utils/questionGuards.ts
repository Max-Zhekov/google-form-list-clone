import type { GetFormQuery } from "../gql/generated";

export type Question = NonNullable<GetFormQuery["form"]>["questions"][number];

export function isTextQuestion(
  q: Question,
): q is Extract<Question, { __typename: "TextQuestion" }> {
  return q.__typename === "TextQuestion";
}

export function isCheckboxQuestion(
  q: Question,
): q is Extract<Question, { __typename: "CheckboxQuestion" }> {
  return q.__typename === "CheckboxQuestion";
}

export function isMultipleChoiceQuestion(
  q: Question,
): q is Extract<Question, { __typename: "MultipleChoiceQuestion" }> {
  return q.__typename === "MultipleChoiceQuestion";
}

export function isDateQuestion(
  q: Question,
): q is Extract<Question, { __typename: "DateQuestion" }> {
  return q.__typename === "DateQuestion";
}
