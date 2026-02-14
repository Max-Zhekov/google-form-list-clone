import type { Answer, Question } from "@shared/types";
import type { GqlQuestionType, QuestionInput } from "./types";
import { id } from "./db";

export function mapSharedTypeToGraphql(t: Question["type"]): GqlQuestionType {
  switch (t) {
    case "text":
      return "TEXT";
    case "multiple_choice":
      return "MULTIPLE_CHOICE";
    case "checkbox":
      return "CHECKBOX";
    case "date":
      return "DATE";
  }
}

export function buildQuestion(
  q: QuestionInput,
  orderFallback: number,
): Question {
  const qId = id("q");

  if (q.type === "TEXT") {
    const data = q.text;
    if (!data) throw new Error("TEXT question requires 'text' input");
    return {
      id: qId,
      type: "text",
      title: data.title,
      required: data.required,
      order: data.order ?? orderFallback,
      placeholder: data.placeholder ?? undefined,
      maxLength: data.maxLength ?? undefined,
    };
  }

  if (q.type === "MULTIPLE_CHOICE") {
    const data = q.multipleChoice;
    if (!data)
      throw new Error(
        "MULTIPLE_CHOICE question requires 'multipleChoice' input",
      );
    return {
      id: qId,
      type: "multiple_choice",
      title: data.title,
      required: data.required,
      order: data.order ?? orderFallback,
      options: data.options,
    };
  }

  if (q.type === "CHECKBOX") {
    const data = q.checkbox;
    if (!data) throw new Error("CHECKBOX question requires 'checkbox' input");
    return {
      id: qId,
      type: "checkbox",
      title: data.title,
      required: data.required,
      order: data.order ?? orderFallback,
      options: data.options,
      minSelected: data.minSelected ?? undefined,
      maxSelected: data.maxSelected ?? undefined,
    };
  }

  const data = q.date;
  if (!data) throw new Error("DATE question requires 'date' input");
  return {
    id: qId,
    type: "date",
    title: data.title,
    required: data.required,
    order: data.order ?? orderFallback,
  };
}

export function toGqlAnswer(a: Answer): {
  questionId: string;
  type: GqlQuestionType;
  textValue?: string;
  multipleChoiceValue?: string;
  checkboxValue?: string[];
  dateValue?: string;
} {
  if (a.type === "text")
    return { questionId: a.questionId, type: "TEXT", textValue: a.value };
  if (a.type === "multiple_choice")
    return {
      questionId: a.questionId,
      type: "MULTIPLE_CHOICE",
      multipleChoiceValue: a.value,
    };
  if (a.type === "checkbox")
    return {
      questionId: a.questionId,
      type: "CHECKBOX",
      checkboxValue: a.value,
    };
  return { questionId: a.questionId, type: "DATE", dateValue: a.value };
}
