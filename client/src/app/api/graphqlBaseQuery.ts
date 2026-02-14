import type { BaseQueryFn } from "@reduxjs/toolkit/query";

type GraphqlRequest = { query: string; variables?: Record<string, unknown> };
type GraphqlError = { message: string };

type GraphqlResponse<T> =
  | { data: T; errors?: undefined }
  | { data?: undefined; errors: GraphqlError[] };

export const graphqlBaseQuery =
  (): BaseQueryFn<GraphqlRequest, unknown, { status: number; data: unknown }> =>
  async ({ query, variables }) => {
    const res = await fetch("http://localhost:4000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const json = (await res.json()) as GraphqlResponse<unknown>;

    if ("errors" in json) {
      return { error: { status: res.status, data: json.errors } };
    }

    return { data: json.data };
  };
