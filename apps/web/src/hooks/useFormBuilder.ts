export type UiQuestionType = "text" | "multiple_choice" | "checkbox" | "date";

export type UiQuestion = {
  id: string;
  type: UiQuestionType;
  title: string;
  required: boolean;
  order: number;

  placeholder?: string;
  maxLength?: string;

  options?: string[];
  minSelected?: string;
  maxSelected?: string;
};

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`;
}

function renumber(list: UiQuestion[]): UiQuestion[] {
  return list.map((question, idx) => ({ ...question, order: idx }));
}

export function useFormBuilder() {
  function addQuestion(list: UiQuestion[], type: UiQuestionType): UiQuestion[] {
    const base: UiQuestion = {
      id: uid("uiq"),
      type,
      title: "",
      required: false,
      order: list.length,
    };

    const question: UiQuestion =
      type === "text"
        ? { ...base, placeholder: "", maxLength: "" }
        : type === "date"
          ? base
          : { ...base, options: ["Option 1"] };

    return renumber([...list, question]);
  }

  function removeQuestion(list: UiQuestion[], id: string): UiQuestion[] {
    return renumber(list.filter((question) => question.id !== id));
  }

  function patchQuestion(
    list: UiQuestion[],
    id: string,
    patch: Partial<UiQuestion>,
  ): UiQuestion[] {
    return list.map((q) => (q.id === id ? { ...q, ...patch } : q));
  }

  function addOption(list: UiQuestion[], id: string): UiQuestion[] {
    return list.map((question) => {
      if (question.id !== id) return question;

      const options = question.options ?? ["Option 1"];

      return {
        ...question,
        options: [...options, `Option ${options.length + 1}`],
      };
    });
  }

  function updateOption(
    list: UiQuestion[],
    id: string,
    index: number,
    value: string,
  ): UiQuestion[] {
    return list.map((question) => {
      if (question.id !== id) return question;

      const options = [...(question.options ?? [])];
      options[index] = value;
      return { ...question, options };
    });
  }

  function removeOption(
    list: UiQuestion[],
    id: string,
    index: number,
  ): UiQuestion[] {
    return list.map((question) => {
      if (question.id !== id) return question;

      const options = (question.options ?? []).filter((_, id) => id !== index);
      return { ...question, options: options.length ? options : ["Option 1"] };
    });
  }

  return {
    addQuestion,
    removeQuestion,
    patchQuestion,
    addOption,
    updateOption,
    removeOption,
  };
}
