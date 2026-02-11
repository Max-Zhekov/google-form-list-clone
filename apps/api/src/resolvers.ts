import type { Answer, Form, FormResponse, Question } from "@shared/types";
import { db, id, nowIso } from "./db";
import type {
  CreateFormInput,
  SubmitResponseInput,
  UpdateFormInput,
} from "./types";
import { buildQuestion, mapSharedTypeToGraphql, toGqlAnswer } from "./mappers";

export const resolvers = {
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
      if (obj.type === "single") return "SingleChoiceQuestion";
      return "MultiChoiceQuestion";
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
    createForm: (_: unknown, args: { input: CreateFormInput }): Form => {
      const formId = id("form");
      const createdAt = nowIso();

      const questions: Question[] = args.input.questions.map((q, idx) =>
        buildQuestion(q, idx),
      );

      const form: Form = {
        id: formId,
        title: args.input.title,
        description: args.input.description ?? undefined,
        createdAt,
        updatedAt: createdAt,
        questions,
      };

      db.forms.set(formId, form);
      if (!db.responses.has(formId)) db.responses.set(formId, []);
      return form;
    },

    updateForm: (
      _: unknown,
      args: { id: string; input: UpdateFormInput },
    ): Form => {
      const existing = db.forms.get(args.id);
      if (!existing) throw new Error("Form not found");

      const updatedAt = nowIso();

      const next: Form = {
        ...existing,
        title: args.input.title ?? existing.title,
        description:
          args.input.description === undefined
            ? existing.description
            : (args.input.description ?? undefined),
        updatedAt,
        questions:
          args.input.questions == null
            ? existing.questions
            : args.input.questions.map((q, idx) => buildQuestion(q, idx)),
      };

      db.forms.set(args.id, next);
      return next;
    },

    deleteForm: (_: unknown, args: { id: string }): boolean => {
      const existed = db.forms.delete(args.id);
      db.responses.delete(args.id);
      return existed;
    },

    submitResponse: (
      _: unknown,
      args: { formId: string; input: SubmitResponseInput },
    ): FormResponse => {
      const form = db.forms.get(args.formId);
      if (!form) throw new Error("Form not found");

      const responseId = id("resp");
      const createdAt = nowIso();

      const answers: Answer[] = args.input.answers.map((a): Answer => {
        if (a.type === "TEXT") {
          return {
            questionId: a.questionId,
            type: "text",
            value: a.textValue ?? "",
          };
        }
        if (a.type === "SINGLE") {
          return {
            questionId: a.questionId,
            type: "single",
            value: a.singleValue ?? "",
          };
        }
        return {
          questionId: a.questionId,
          type: "multi",
          value: a.multiValue ?? [],
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

  FormResponse: {
    answers(r: FormResponse) {
      return r.answers.map(toGqlAnswer);
    },
  },
} as const;
