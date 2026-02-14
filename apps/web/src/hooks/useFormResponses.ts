import { useMemo } from "react";

import type {
  QuestionView,
  AnswerView,
  ResponseView,
  ResponseAnswer,
  FormById,
  FormResponseItem,
} from "../types/formResponsesTypes.types";

function formatAnswer(a: ResponseAnswer): string {
  if (a.type === "TEXT") return a.textValue ?? "";
  if (a.type === "MULTIPLE_CHOICE") return a.multipleChoiceValue ?? "";
  if (a.type === "CHECKBOX") return (a.checkboxValue ?? []).join(", ");
  return a.dateValue ?? "";
}

export function useFormResponses(
  form: FormById | undefined,
  responses: FormResponseItem[] | undefined,
) {
  return useMemo<ResponseView[]>(() => {
    if (!form || !responses) return [];

    const questionById = new Map<string, QuestionView>();
    for (const q of form.questions) {
      questionById.set(q.id, {
        id: q.id,
        title: q.title,
        type: q.type,
        options: "options" in q ? (q.options ?? null) : null,
      });
    }

    return responses.map((r) => {
      const answers: AnswerView[] = r.answers.map((a) => {
        const q = questionById.get(a.questionId);
        return {
          questionId: a.questionId,
          questionTitle: q?.title ?? a.questionId,
          type: a.type,
          value: formatAnswer(a),
        };
      });

      return {
        id: r.id,
        createdAt: r.createdAt,
        answers,
      };
    });
  }, [form, responses]);
}
