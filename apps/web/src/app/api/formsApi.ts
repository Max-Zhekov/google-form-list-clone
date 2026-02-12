import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlBaseQuery } from "./graphqlBaseQuery";

export type FormListItem = {
  id: string;
  title: string;
  description?: string | null;
};

type FormsQueryData = { forms: FormListItem[] };

type CreateFormArgs = {
  title: string;
  description?: string | null;
  questions: unknown[];
};

type CreateFormData = { createForm: { id: string; title: string } };

type FormQuestion =
  | {
      id: string;
      type: "TEXT";
      title: string;
      required: boolean;
      order: number;
      placeholder?: string | null;
      maxLength?: number | null;
      options?: never;
      minSelected?: never;
      maxSelected?: never;
    }
  | {
      id: string;
      type: "MULTIPLE_CHOICE";
      title: string;
      required: boolean;
      order: number;
      options: string[];
      placeholder?: never;
      maxLength?: never;
      minSelected?: never;
      maxSelected?: never;
    }
  | {
      id: string;
      type: "CHECKBOX";
      title: string;
      required: boolean;
      order: number;
      options: string[];
      minSelected?: number | null;
      maxSelected?: number | null;
      placeholder?: never;
      maxLength?: never;
    }
  | {
      id: string;
      type: "DATE";
      title: string;
      required: boolean;
      order: number;
      placeholder?: never;
      maxLength?: never;
      options?: never;
      minSelected?: never;
      maxSelected?: never;
    };

export type SubmitAnswer = {
  questionId: string;
  type: "TEXT" | "MULTIPLE_CHOICE" | "CHECKBOX" | "DATE";
  textValue?: string | null;
  multipleChoiceValue?: string | null;
  checkboxValue?: string[] | null;
  dateValue?: string | null;
};

type SubmitResponseArgs = {
  formId: string;
  answers: SubmitAnswer[];
};

type SubmitResponseData = {
  submitResponse: { id: string; createdAt: string };
};

export type FormById = {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  questions: FormQuestion[];
};

type FormQueryData = { form: FormById | null };

export const formsApi = createApi({
  reducerPath: "formsApi",
  baseQuery: graphqlBaseQuery(),
  tagTypes: ["Forms"],
  endpoints: (builder) => ({
    getForms: builder.query<FormListItem[], void>({
      query: () => ({
        query: `
          query {
            forms { id title description }
          }
        `,
      }),
      transformResponse: (response) => (response as FormsQueryData).forms,
      providesTags: ["Forms"],
    }),

    createForm: builder.mutation<{ id: string; title: string }, CreateFormArgs>(
      {
        query: (args) => ({
          query: `
           mutation CreateForm($title: String!, $description: String, $questions: [QuestionInput!]) {
            createForm(title: $title, description: $description, questions: $questions) {
              id
              title
            }
          }`,
          variables: {
            title: args.title,
            description: args.description ?? null,
            questions: args.questions,
          },
        }),
        transformResponse: (response) =>
          (response as CreateFormData).createForm,
        invalidatesTags: ["Forms"],
      },
    ),

    getForm: builder.query<FormById, string>({
      query: (id) => ({
        query: `
      query GetForm($id: ID!) {
        form(id: $id) {
          id
          title
          description
          createdAt
          updatedAt
          questions {
            id
            type
            title
            required
            order

            ... on TextQuestion { placeholder maxLength }
            ... on MultipleChoiceQuestion { options }
            ... on CheckboxQuestion { options minSelected maxSelected }
            ... on DateQuestion { id } 
          }
        }
      }
    `,
        variables: { id },
      }),
      transformResponse: (response) => {
        const data = response as FormQueryData;
        if (!data.form) throw new Error("Form not found");
        return data.form;
      },
    }),

    submitResponse: builder.mutation<
      { id: string; createdAt: string },
      SubmitResponseArgs
    >({
      query: (args) => ({
        query: `
      mutation SubmitResponse($formId: ID!, $answers: [AnswerInput!]!) {
        submitResponse(formId: $formId, answers: $answers) {
          id
          createdAt
        }
      }
    `,
        variables: {
          formId: args.formId,
          answers: args.answers,
        },
      }),
      transformResponse: (response) =>
        (response as SubmitResponseData).submitResponse,
    }),
  }),
});

export const {
  useGetFormsQuery,
  useCreateFormMutation,
  useGetFormQuery,
  useSubmitResponseMutation,
} = formsApi;
