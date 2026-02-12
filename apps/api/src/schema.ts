export const typeDefs = /* GraphQL */ `
  scalar DateTime

  enum QuestionType {
    TEXT
    MULTIPLE_CHOICE
    CHECKBOX
    DATE
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

  type MultipleChoiceQuestion implements Question {
    id: ID!
    title: String!
    required: Boolean!
    order: Int!
    type: QuestionType!
    options: [String!]!
  }

  type CheckboxQuestion implements Question {
    id: ID!
    title: String!
    required: Boolean!
    order: Int!
    type: QuestionType!
    options: [String!]!
    minSelected: Int
    maxSelected: Int
  }

  type DateQuestion implements Question {
    id: ID!
    title: String!
    required: Boolean!
    order: Int!
    type: QuestionType!
  }

  input TextQuestionInput {
    title: String!
    required: Boolean!
    order: Int!
    placeholder: String
    maxLength: Int
  }

  input MultipleChoiceQuestionInput {
    title: String!
    required: Boolean!
    order: Int!
    options: [String!]!
  }

  input CheckboxQuestionInput {
    title: String!
    required: Boolean!
    order: Int!
    options: [String!]!
    minSelected: Int
    maxSelected: Int
  }

  input DateQuestionInput {
    title: String!
    required: Boolean!
    order: Int!
  }

  input QuestionInput {
    type: QuestionType!
    text: TextQuestionInput
    multipleChoice: MultipleChoiceQuestionInput
    checkbox: CheckboxQuestionInput
    date: DateQuestionInput
  }

  type Answer {
    questionId: ID!
    type: QuestionType!
    textValue: String
    multipleChoiceValue: String
    checkboxValue: [String!]
    dateValue: String
  }

  type Response {
    id: ID!
    formId: ID!
    createdAt: DateTime!
    answers: [Answer!]!
  }

  input AnswerInput {
    questionId: ID!
    type: QuestionType!
    textValue: String
    multipleChoiceValue: String
    checkboxValue: [String!]
    dateValue: String
  }

  type Query {
    health: String!
    forms: [Form!]!
    form(id: ID!): Form
    responses(formId: ID!): [Response!]!
  }

  type Mutation {
    createForm(title: String!, description: String, questions: [QuestionInput!]): Form!
    submitResponse(formId: ID!, answers: [AnswerInput!]!): Response!
  }
`;
