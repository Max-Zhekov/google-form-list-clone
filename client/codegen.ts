import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:4000/",
  documents: ["src/gql/operations/**/*.graphql"],
  generates: {
    "src/gql/generated.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        enumsAsTypes: true,
        scalars: {
          DateTime: "string",
        },
      },
    },
  },
};

export default config;
