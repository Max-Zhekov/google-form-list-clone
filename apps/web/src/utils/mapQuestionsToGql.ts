import type { UiQuestion } from "../hooks/useFormBuilder";

function toIntOrNull(v: string | undefined): number | null {
  const t = (v ?? "").trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function mapQuestionsToGql(questions: UiQuestion[]): unknown[] {
  return questions.map((q) => {
    if (q.type === "text") {
      return {
        type: "TEXT",
        text: {
          title: q.title,
          required: q.required,
          order: q.order,
          placeholder: q.placeholder?.trim() ? q.placeholder : null,
          maxLength: toIntOrNull(q.maxLength),
        },
      };
    }

    if (q.type === "multiple_choice") {
      return {
        type: "MULTIPLE_CHOICE",
        multipleChoice: {
          title: q.title,
          required: q.required,
          order: q.order,
          options: (q.options ?? []).map((x) => x.trim()).filter(Boolean),
        },
      };
    }

    if (q.type === "checkbox") {
      return {
        type: "CHECKBOX",
        checkbox: {
          title: q.title,
          required: q.required,
          order: q.order,
          options: (q.options ?? []).map((x) => x.trim()).filter(Boolean),
          minSelected: toIntOrNull(q.minSelected),
          maxSelected: toIntOrNull(q.maxSelected),
        },
      };
    }

    return {
      type: "DATE",
      date: {
        title: q.title,
        required: q.required,
        order: q.order,
      },
    };
  });
}
