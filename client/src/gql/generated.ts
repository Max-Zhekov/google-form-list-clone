export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

export type Answer = {
  __typename?: 'Answer';
  checkboxValue?: Maybe<Array<Scalars['String']['output']>>;
  dateValue?: Maybe<Scalars['String']['output']>;
  multipleChoiceValue?: Maybe<Scalars['String']['output']>;
  questionId: Scalars['ID']['output'];
  textValue?: Maybe<Scalars['String']['output']>;
  type: QuestionType;
};

export type AnswerInput = {
  checkboxValue?: InputMaybe<Array<Scalars['String']['input']>>;
  dateValue?: InputMaybe<Scalars['String']['input']>;
  multipleChoiceValue?: InputMaybe<Scalars['String']['input']>;
  questionId: Scalars['ID']['input'];
  textValue?: InputMaybe<Scalars['String']['input']>;
  type: QuestionType;
};

export type CheckboxQuestion = Question & {
  __typename?: 'CheckboxQuestion';
  id: Scalars['ID']['output'];
  maxSelected?: Maybe<Scalars['Int']['output']>;
  minSelected?: Maybe<Scalars['Int']['output']>;
  options: Array<Scalars['String']['output']>;
  order: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  type: QuestionType;
};

export type CheckboxQuestionInput = {
  maxSelected?: InputMaybe<Scalars['Int']['input']>;
  minSelected?: InputMaybe<Scalars['Int']['input']>;
  options: Array<Scalars['String']['input']>;
  order: Scalars['Int']['input'];
  required: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type DateQuestion = Question & {
  __typename?: 'DateQuestion';
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  type: QuestionType;
};

export type DateQuestionInput = {
  order: Scalars['Int']['input'];
  required: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type Form = {
  __typename?: 'Form';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  questions: Array<Question>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type MultipleChoiceQuestion = Question & {
  __typename?: 'MultipleChoiceQuestion';
  id: Scalars['ID']['output'];
  options: Array<Scalars['String']['output']>;
  order: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  type: QuestionType;
};

export type MultipleChoiceQuestionInput = {
  options: Array<Scalars['String']['input']>;
  order: Scalars['Int']['input'];
  required: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createForm: Form;
  submitResponse: Response;
};


export type MutationCreateFormArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<Array<QuestionInput>>;
  title: Scalars['String']['input'];
};


export type MutationSubmitResponseArgs = {
  answers: Array<AnswerInput>;
  formId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  form?: Maybe<Form>;
  forms: Array<Form>;
  health: Scalars['String']['output'];
  responses: Array<Response>;
};


export type QueryFormArgs = {
  id: Scalars['ID']['input'];
};


export type QueryResponsesArgs = {
  formId: Scalars['ID']['input'];
};

export type Question = {
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  type: QuestionType;
};

export type QuestionInput = {
  checkbox?: InputMaybe<CheckboxQuestionInput>;
  date?: InputMaybe<DateQuestionInput>;
  multipleChoice?: InputMaybe<MultipleChoiceQuestionInput>;
  text?: InputMaybe<TextQuestionInput>;
  type: QuestionType;
};

export type QuestionType =
  | 'CHECKBOX'
  | 'DATE'
  | 'MULTIPLE_CHOICE'
  | 'TEXT';

export type Response = {
  __typename?: 'Response';
  answers: Array<Answer>;
  createdAt: Scalars['DateTime']['output'];
  formId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
};

export type TextQuestion = Question & {
  __typename?: 'TextQuestion';
  id: Scalars['ID']['output'];
  maxLength?: Maybe<Scalars['Int']['output']>;
  order: Scalars['Int']['output'];
  placeholder?: Maybe<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  type: QuestionType;
};

export type TextQuestionInput = {
  maxLength?: InputMaybe<Scalars['Int']['input']>;
  order: Scalars['Int']['input'];
  placeholder?: InputMaybe<Scalars['String']['input']>;
  required: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type CreateFormMutationVariables = Exact<{
  title: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<Array<QuestionInput> | QuestionInput>;
}>;


export type CreateFormMutation = { __typename?: 'Mutation', createForm: { __typename?: 'Form', id: string, title: string } };

export type GetFormQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFormQuery = { __typename?: 'Query', form?: { __typename?: 'Form', id: string, title: string, description?: string | null, createdAt: string, updatedAt: string, questions: Array<
      | { __typename: 'CheckboxQuestion', options: Array<string>, minSelected?: number | null, maxSelected?: number | null, id: string, type: QuestionType, title: string, required: boolean, order: number }
      | { __typename: 'DateQuestion', id: string, type: QuestionType, title: string, required: boolean, order: number }
      | { __typename: 'MultipleChoiceQuestion', options: Array<string>, id: string, type: QuestionType, title: string, required: boolean, order: number }
      | { __typename: 'TextQuestion', placeholder?: string | null, maxLength?: number | null, id: string, type: QuestionType, title: string, required: boolean, order: number }
    > } | null };

export type GetFormsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFormsQuery = { __typename?: 'Query', forms: Array<{ __typename?: 'Form', id: string, title: string, description?: string | null }> };

export type ResponsesQueryVariables = Exact<{
  formId: Scalars['ID']['input'];
}>;


export type ResponsesQuery = { __typename?: 'Query', responses: Array<{ __typename?: 'Response', id: string, createdAt: string, answers: Array<{ __typename?: 'Answer', questionId: string, type: QuestionType, textValue?: string | null, multipleChoiceValue?: string | null, checkboxValue?: Array<string> | null, dateValue?: string | null }> }> };

export type SubmitResponseMutationVariables = Exact<{
  formId: Scalars['ID']['input'];
  answers: Array<AnswerInput> | AnswerInput;
}>;


export type SubmitResponseMutation = { __typename?: 'Mutation', submitResponse: { __typename?: 'Response', id: string, createdAt: string } };
