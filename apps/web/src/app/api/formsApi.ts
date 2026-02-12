import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlBaseQuery } from "./graphqlBaseQuery";

export type FormListItem = {
  id: string;
  title: string;
  description?: string | null;
};

type FormsQueryData = { forms: FormListItem[] };

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
  }),
});

export const { useGetFormsQuery } = formsApi;
