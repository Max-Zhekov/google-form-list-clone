import { useMemo, useState } from "react";
import type {
  GetFormQuery,
  SubmitResponseMutationVariables,
  QuestionType,
} from "../gql/generated";

type FormById = NonNullable<GetFormQuery["form"]>;

type AnswersVar = SubmitResponseMutationVariables["answers"];
type ArrayItem<T> = T extends ReadonlyArray<infer U> ? U : T;
type SubmitAnswer = ArrayItem<AnswersVar>;

type AnswerState =
  | { type: "TEXT"; value: string }
  | { type: "MULTIPLE_CHOICE"; value: string }
  | { type: "CHECKBOX"; value: string[] }
  | { type: "DATE"; value: string };

/**
 * ВАЖНО:
 * Codegen ожидает type: QuestionType (а не просто string)
 * Поэтому мы маппим наши локальные строки -> значения QuestionType.
 *
 * Если в твоём schema value называется не "MULTIPLE_CHOICE", а иначе —
 * поменяешь ТОЛЬКО тут, в одном месте.
 */
function toGqlQuestionType(t: AnswerState["type"]): QuestionType {
  switch (t) {
    case "TEXT":
      return "TEXT";
    case "MULTIPLE_CHOICE":
      // если у тебя в schema было "MULTIPLE_CHOICE" — ок
      // если вдруг "SINGLE" — поменяй на "SINGLE"
      return "MULTIPLE_CHOICE";
    case "CHECKBOX":
      return "CHECKBOX";
    case "DATE":
      return "DATE";
  }
}

function buildInitialAnswers(form: FormById): Map<string, AnswerState> {
  const map = new Map<string, AnswerState>();

  for (const q of form.questions) {
    // q.type тут уже из codegen (QuestionType)
    if (q.type === "TEXT") map.set(q.id, { type: "TEXT", value: "" });

    if (q.type === "MULTIPLE_CHOICE")
      map.set(q.id, { type: "MULTIPLE_CHOICE", value: "" });

    if (q.type === "CHECKBOX") map.set(q.id, { type: "CHECKBOX", value: [] });

    if (q.type === "DATE") map.set(q.id, { type: "DATE", value: "" });
  }

  return map;
}

function toSubmitAnswers(state: Map<string, AnswerState>): SubmitAnswer[] {
  const out: SubmitAnswer[] = [];

  for (const [questionId, a] of state.entries()) {
    const type = toGqlQuestionType(a.type);

    if (a.type === "TEXT") {
      out.push({ questionId, type, textValue: a.value } as SubmitAnswer);
      continue;
    }

    if (a.type === "MULTIPLE_CHOICE") {
      out.push({
        questionId,
        type,
        multipleChoiceValue: a.value,
      } as SubmitAnswer);
      continue;
    }

    if (a.type === "CHECKBOX") {
      out.push({ questionId, type, checkboxValue: a.value } as SubmitAnswer);
      continue;
    }

    // DATE
    out.push({ questionId, type, dateValue: a.value } as SubmitAnswer);
  }

  return out;
}

type FillState = {
  formId: string | null;
  answers: Map<string, AnswerState>;
};

export function useFillForm(form: FormById | undefined) {
  const [state, setState] = useState<FillState>(() => ({
    formId: form?.id ?? null,
    answers: form ? buildInitialAnswers(form) : new Map(),
  }));

  // безопасный ресет при смене формы (без useEffect)
  if (form && state.formId !== form.id) {
    setState({
      formId: form.id,
      answers: buildInitialAnswers(form),
    });
  }

  const answers = state.answers;

  const sortedQuestions = useMemo(() => {
    if (!form) return [];
    return [...form.questions].sort((a, b) => a.order - b.order);
  }, [form]);

  function setText(qId: string, value: string) {
    const q = form?.questions.find((x) => x.id === qId);
    const max =
      q && "maxLength" in q ? (q.maxLength ?? null) : null;
    const nextValue = max ? value.slice(0, max) : value;

    setState((prev) => ({
      ...prev,
      answers: new Map(prev.answers).set(qId, {
        type: "TEXT",
        value: nextValue,
      }),
    }));
  }

  function setRadio(qId: string, value: string) {
    setState((prev) => ({
      ...prev,
      answers: new Map(prev.answers).set(qId, {
        type: "MULTIPLE_CHOICE",
        value,
      }),
    }));
  }

  function toggleCheckbox(qId: string, option: string, checked: boolean) {
    setState((prev) => {
      const next = new Map(prev.answers);
      const cur = next.get(qId);
      const list = cur && cur.type === "CHECKBOX" ? cur.value : [];
      const set = new Set(list);

      if (checked) set.add(option);
      else set.delete(option);

      next.set(qId, { type: "CHECKBOX", value: [...set] });

      return { ...prev, answers: next };
    });
  }

  function setDate(qId: string, value: string) {
    setState((prev) => ({
      ...prev,
      answers: new Map(prev.answers).set(qId, { type: "DATE", value }),
    }));
  }

  function requiredMissing(): boolean {
    if (!form) return false;

    for (const q of form.questions) {
      if (!q.required) continue;

      const a = answers.get(q.id);
      if (!a) return true;

      if (a.type === "TEXT" && !a.value.trim()) return true;
      if (a.type === "MULTIPLE_CHOICE" && !a.value.trim()) return true;
      if (a.type === "CHECKBOX" && a.value.length === 0) return true;
      if (a.type === "DATE" && !a.value.trim()) return true;
    }

    return false;
  }

  return {
    answers,
    sortedQuestions,
    setText,
    setRadio,
    toggleCheckbox,
    setDate,
    requiredMissing,
    toSubmitAnswers: () => toSubmitAnswers(answers),
  };
}
