import { useMemo, useState } from "react";
import type { FormById, SubmitAnswer } from "../app/api/formsApi";

type AnswerState =
  | { type: "TEXT"; value: string }
  | { type: "MULTIPLE_CHOICE"; value: string }
  | { type: "CHECKBOX"; value: string[] }
  | { type: "DATE"; value: string };

function buildInitialAnswers(form: FormById): Map<string, AnswerState> {
  const map = new Map<string, AnswerState>();
  for (const q of form.questions) {
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
    if (a.type === "TEXT")
      out.push({ questionId, type: "TEXT", textValue: a.value });
    if (a.type === "MULTIPLE_CHOICE")
      out.push({
        questionId,
        type: "MULTIPLE_CHOICE",
        multipleChoiceValue: a.value,
      });
    if (a.type === "CHECKBOX")
      out.push({ questionId, type: "CHECKBOX", checkboxValue: a.value });
    if (a.type === "DATE")
      out.push({ questionId, type: "DATE", dateValue: a.value });
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
    const max = q?.type === "TEXT" ? (q.maxLength ?? null) : null;
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
