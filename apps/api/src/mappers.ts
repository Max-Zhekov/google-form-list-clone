import type { Answer, Question } from "@shared/types";
import type { GqlQuestionType, QuestionInput } from "./types";
import { id } from "./db";

export function mapSharedTypeToGraphql(t: Question["type"]): GqlQuestionType {
  switch (t) {
    case "text":
      return "TEXT";
    case "single":
      return "SINGLE";
    case "multi":
      return "MULTI";
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

  if (q.type === "SINGLE") {
    const data = q.single;
    if (!data) throw new Error("SINGLE question requires 'single' input");

    return {
      id: qId,
      type: "single",
      title: data.title,
      required: data.required,
      order: data.order ?? orderFallback,
      options: data.options,
    };
  }

  const data = q.multi;
  if (!data) throw new Error("MULTI question requires 'multi' input");

  return {
    id: qId,
    type: "multi",
    title: data.title,
    required: data.required,
    order: data.order ?? orderFallback,
    options: data.options,
    minSelected: data.minSelected ?? undefined,
    maxSelected: data.maxSelected ?? undefined,
  };
}

export function toGqlAnswer(a: Answer): {
  questionId: string;
  type: GqlQuestionType;
  textValue?: string;
  singleValue?: string;
  multiValue?: string[];
} {
  if (a.type === "text") {
    return { questionId: a.questionId, type: "TEXT", textValue: a.value };
  }
  if (a.type === "single") {
    return { questionId: a.questionId, type: "SINGLE", singleValue: a.value };
  }
  return { questionId: a.questionId, type: "MULTI", multiValue: a.value };
}
