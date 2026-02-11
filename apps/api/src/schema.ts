export const typeDefs = /* GraphQL */ `
  scalar DateTime

  enum QuestionType {
    TEXT
    SINGLE
    MULTI
  }

  type Form {
    id: ID!
    title: String!
    description: String
    createdAt: DateTime!
    updatedAt: DateTime!
    questions: [Question!]!
  }

  interface Question {
    id: ID!
    title: String!
    required: Boolean!
    order: Int!
    type: QuestionType!
  }

  type TextQuestion implements Question {
    id: ID!
    title: String!
    required: Boolean!
    order: Int!
    type: QuestionType!
    placeholder: String
    maxLength: Int
  }

  type SingleChoiceQuestion implements Question {
    id: ID!
    title: String!
    required: Boolean!
    order: Int!
    type: QuestionType!
    options: [String!]!
  }

  type MultiChoiceQuestion implements Question {
    id: ID!
    title: String!
    required: Boolean!
    order: Int!
    type: QuestionType!
    options: [String!]!
    minSelected: Int
    maxSelected: Int
  }

  input TextQuestionInput {
    title: String!
    required: Boolean!
    order: Int!
    placeholder: String
    maxLength: Int
  }

  input SingleChoiceQuestionInput {
    title: String!
    required: Boolean!
    order: Int!
    options: [String!]!
  }

  input MultiChoiceQuestionInput {
    title: String!
    required: Boolean!
    order: Int!
    options: [String!]!
    minSelected: Int
    maxSelected: Int
  }

  input QuestionInput {
    type: QuestionType!
    text: TextQuestionInput
    single: SingleChoiceQuestionInput
    multi: MultiChoiceQuestionInput
  }

  input CreateFormInput {
    title: String!
    description: String
    questions: [QuestionInput!]!
  }

  input UpdateFormInput {
    title: String
    description: String
    questions: [QuestionInput!]
  }

  type Answer {
    questionId: ID!
    type: QuestionType!
    textValue: String
    singleValue: String
    multiValue: [String!]
  }

  type FormResponse {
    id: ID!
    formId: ID!
    createdAt: DateTime!
    answers: [Answer!]!
  }

  input AnswerInput {
    questionId: ID!
    type: QuestionType!
    textValue: String
    singleValue: String
    multiValue: [String!]
  }

  input SubmitResponseInput {
    answers: [AnswerInput!]!
  }

  type Query {
    health: String!
    forms: [Form!]!
    form(id: ID!): Form
    responses(formId: ID!): [FormResponse!]!
  }

  type Mutation {
    createForm(input: CreateFormInput!): Form!
    updateForm(id: ID!, input: UpdateFormInput!): Form!
    deleteForm(id: ID!): Boolean!
    submitResponse(formId: ID!, input: SubmitResponseInput!): FormResponse!
  }
`;
