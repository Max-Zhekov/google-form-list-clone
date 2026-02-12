import type { Answer, Form, FormResponse, Question } from "@shared/types";
import { db, id, nowIso } from "./db";
import type { AnswerInput, QuestionInput } from "./types";
import { buildQuestion, mapSharedTypeToGraphql, toGqlAnswer } from "./mappers";

type CreateFormArgs = {
  title: string;
  description?: string | null;
  questions?: QuestionInput[] | null;
};

type SubmitResponseArgs = {
  formId: string;
  answers: AnswerInput[];
};

export const resolvers = {
  TextQuestion: {
    type: () => "TEXT",
  },
  MultipleChoiceQuestion: {
    type: () => "MULTIPLE_CHOICE",
  },
  CheckboxQuestion: {
    type: () => "CHECKBOX",
  },
  DateQuestion: {
    type: () => "DATE",
  },

  DateTime: {
    serialize(value: unknown) {
      if (typeof value === "string") return value;
      if (value instanceof Date) return value.toISOString();
      throw new Error("Invalid DateTime value");
    },
  },

  Question: {
    __resolveType(obj: Question) {
      if (obj.type === "text") return "TextQuestion";
      if (obj.type === "multiple_choice") return "MultipleChoiceQuestion";
      if (obj.type === "checkbox") return "CheckboxQuestion";
      return "DateQuestion";
    },
    type(obj: Question) {
      return mapSharedTypeToGraphql(obj.type);
    },
  },

  Form: {
    questions(form: Form) {
      return [...form.questions].sort((a, b) => a.order - b.order);
    },
  },

  Query: {
    health: () => "ok",
    forms: () => Array.from(db.forms.values()),
    form: (_: unknown, args: { id: string }) => db.forms.get(args.id) ?? null,
    responses: (_: unknown, args: { formId: string }) =>
      db.responses.get(args.formId) ?? [],
  },

  Mutation: {
    createForm: (_: unknown, args: CreateFormArgs): Form => {
      const formId = id("form");
      const createdAt = nowIso();

      const questionsInput = args.questions ?? [];
      const questions: Question[] = questionsInput.map((q, idx) =>
        buildQuestion(q, idx),
      );

      const form: Form = {
        id: formId,
        title: args.title,
        description: args.description ?? undefined,
        createdAt,
        updatedAt: createdAt,
        questions,
      };

      db.forms.set(formId, form);
      if (!db.responses.has(formId)) db.responses.set(formId, []);
      return form;
    },

    submitResponse: (_: unknown, args: SubmitResponseArgs): FormResponse => {
      const form = db.forms.get(args.formId);
      if (!form) throw new Error("Form not found");

      const responseId = id("resp");
      const createdAt = nowIso();

      const answers: Answer[] = args.answers.map((a): Answer => {
        if (a.type === "TEXT")
          return {
            questionId: a.questionId,
            type: "text",
            value: a.textValue ?? "",
          };
        if (a.type === "MULTIPLE_CHOICE")
          return {
            questionId: a.questionId,
            type: "multiple_choice",
            value: a.multipleChoiceValue ?? "",
          };
        if (a.type === "CHECKBOX")
          return {
            questionId: a.questionId,
            type: "checkbox",
            value: a.checkboxValue ?? [],
          };
        return {
          questionId: a.questionId,
          type: "date",
          value: a.dateValue ?? "",
        };
      });

      const response: FormResponse = {
        id: responseId,
        formId: args.formId,
        createdAt,
        answers,
      };

      const list = db.responses.get(args.formId) ?? [];
      db.responses.set(args.formId, [response, ...list]);
      return response;
    },
  },

  Response: {
    answers(r: FormResponse) {
      return r.answers.map(toGqlAnswer);
    },
  },
} as const;
