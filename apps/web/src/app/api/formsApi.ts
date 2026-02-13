import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlBaseQuery } from "./graphqlBaseQuery";
import type {
  GetFormsQuery,
  GetFormQuery,
  CreateFormMutation,
  CreateFormMutationVariables,
  SubmitResponseMutation,
  SubmitResponseMutationVariables,
  ResponsesQuery,
  GetFormQueryVariables,
  ResponsesQueryVariables,
} from "../../gql/generated";

export type FormListItem = GetFormsQuery["forms"][number];
export type FormById = NonNullable<GetFormQuery["form"]>;
export type FormResponseItem = ResponsesQuery["responses"][number];

export const formsApi = createApi({
  reducerPath: "formsApi",
  baseQuery: graphqlBaseQuery(),
  tagTypes: ["Forms"],
  endpoints: (builder) => ({
    getForms: builder.query<FormListItem[], void>({
      query: () => ({
        query: `
          query GetForms {
            forms { id title description }
          }
        `,
      }),
      transformResponse: (response) => (response as GetFormsQuery).forms,
      providesTags: ["Forms"],
    }),

    createForm: builder.mutation<
      CreateFormMutation["createForm"],
      CreateFormMutationVariables
    >({
      query: (variables) => ({
        query: `
          mutation CreateForm($title: String!, $description: String, $questions: [QuestionInput!]) {
            createForm(title: $title, description: $description, questions: $questions) {
              id
              title
            }
          }
        `,
        variables,
      }),
      transformResponse: (response) =>
        (response as CreateFormMutation).createForm,
      invalidatesTags: ["Forms"],
    }),

    getForm: builder.query<FormById, GetFormQueryVariables["id"]>({
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
                __typename
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
        const data = response as GetFormQuery;
        if (!data.form) throw new Error("Form not found");
        return data.form;
      },
    }),

    submitResponse: builder.mutation<
      SubmitResponseMutation["submitResponse"],
      SubmitResponseMutationVariables
    >({
      query: (variables) => ({
        query: `
          mutation SubmitResponse($formId: ID!, $answers: [AnswerInput!]!) {
            submitResponse(formId: $formId, answers: $answers) {
              id
              createdAt
            }
          }
        `,
        variables,
      }),
      transformResponse: (response) =>
        (response as SubmitResponseMutation).submitResponse,
    }),

    getResponses: builder.query<
      FormResponseItem[],
      ResponsesQueryVariables["formId"]
    >({
      query: (formId) => ({
        query: `
          query Responses($formId: ID!) {
            responses(formId: $formId) {
              id
              createdAt
              answers {
                questionId
                type
                textValue
                multipleChoiceValue
                checkboxValue
                dateValue
              }
            }
          }
        `,
        variables: { formId },
      }),
      transformResponse: (response) => (response as ResponsesQuery).responses,
    }),
  }),
});

export const {
  useGetFormsQuery,
  useCreateFormMutation,
  useGetFormQuery,
  useSubmitResponseMutation,
  useGetResponsesQuery,
} = formsApi;
