import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetFormQuery,
  useSubmitResponseMutation,
} from "../../app/api/formsApi";
import { useFillForm } from "../../hooks/useFillForm";
import styles from "./FormFillerPage.module.css";

type Question = ReturnType<typeof useFillForm>["sortedQuestions"][number];
type TextQuestion = Extract<Question, { __typename?: "TextQuestion" }>;
type MultipleChoiceQuestion = Extract<
  Question,
  { __typename?: "MultipleChoiceQuestion" }
>;
type CheckboxQuestion = Extract<Question, { __typename?: "CheckboxQuestion" }>;
type DateQuestion = Extract<Question, { __typename?: "DateQuestion" }>;

function isTextQuestion(q: Question): q is TextQuestion {
  return (
    q.__typename === "TextQuestion" ||
    q.type === "TEXT" ||
    "placeholder" in q ||
    "maxLength" in q
  );
}

function isCheckboxQuestion(q: Question): q is CheckboxQuestion {
  return (
    q.__typename === "CheckboxQuestion" ||
    q.type === "CHECKBOX" ||
    "minSelected" in q ||
    "maxSelected" in q
  );
}

function isMultipleChoiceQuestion(q: Question): q is MultipleChoiceQuestion {
  return (
    q.__typename === "MultipleChoiceQuestion" ||
    q.type === "MULTIPLE_CHOICE" ||
    ("options" in q && !("minSelected" in q) && !("maxSelected" in q))
  );
}

function isDateQuestion(q: Question): q is DateQuestion {
  return q.__typename === "DateQuestion" || q.type === "DATE";
}

export function FormFillerPage() {
  const { id } = useParams();
  const formId = id ?? "";

  const {
    data: form,
    isLoading,
    isError,
  } = useGetFormQuery(formId, { skip: !formId });
  const [submitResponse, { isLoading: isSubmitting }] =
    useSubmitResponseMutation();

  const fill = useFillForm(form);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function onSubmit() {
    if (!form) return;

    if (fill.requiredMissing()) {
      setStatus("error");
      return;
    }

    try {
      setStatus("idle");
      await submitResponse({
        formId: form.id,
        answers: fill.toSubmitAnswers(),
      }).unwrap();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (!formId) return <div className={styles["fill"]}>No id</div>;
  if (isLoading) return <div className={styles["fill"]}>Loading…</div>;
  if (isError || !form)
    return <div className={styles["fill"]}>Form not found</div>;

  return (
    <div className={styles["fill"]}>
      <header className={styles["fill__header"]}>
        <div>
          <h1 className={styles["fill__title"]}>{form.title}</h1>
          {form.description && (
            <div className={styles["fill__desc"]}>{form.description}</div>
          )}
        </div>

        <Link
          className={styles["fill__link"]}
          to={`/forms/${form.id}/responses`}>
          View Responses
        </Link>
      </header>

      <div className={styles["fill__list"]}>
        {fill.sortedQuestions.map((q) => {
          const a = fill.answers.get(q.id);

          return (
            <div key={q.id} className={styles["fill__card"]}>
              <div className={styles["fill__qhead"]}>
                <div className={styles["fill__qtitle"]}>
                  {q.title}{" "}
                  {q.required && <span className={styles["fill__req"]}>*</span>}
                </div>
                <div className={styles["fill__qtype"]}>{q.type}</div>
              </div>

              {isTextQuestion(q) && (
                <input
                  className={styles["fill__input"]}
                  placeholder={q.placeholder ?? ""}
                  value={a && a.type === "TEXT" ? a.value : ""}
                  onChange={(e) => fill.setText(q.id, e.target.value)}
                  maxLength={q.maxLength ?? undefined}
                />
              )}

              {isMultipleChoiceQuestion(q) && (
                <div className={styles["fill__options"]}>
                  {q.options.map((opt) => (
                    <label key={opt} className={styles["fill__option"]}>
                      <input
                        type="radio"
                        name={q.id}
                        checked={
                          a && a.type === "MULTIPLE_CHOICE"
                            ? a.value === opt
                            : false
                        }
                        onChange={(e) => fill.setRadio(q.id, e.target.value)}
                        value={opt}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {isCheckboxQuestion(q) && (
                <div className={styles["fill__options"]}>
                  {q.options.map((opt) => {
                    const checked =
                      a && a.type === "CHECKBOX"
                        ? a.value.includes(opt)
                        : false;
                    return (
                      <label key={opt} className={styles["fill__option"]}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            fill.toggleCheckbox(q.id, opt, e.target.checked)
                          }
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
              )}

              {isDateQuestion(q) && (
                <input
                  className={styles["fill__input"]}
                  type="date"
                  value={a && a.type === "DATE" ? a.value : ""}
                  onChange={(e) => fill.setDate(q.id, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className={styles["fill__footer"]}>
        <button
          className={styles["fill__submit"]}
          disabled={isSubmitting}
          onClick={() => void onSubmit()}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        {status === "success" && (
          <div className={styles["fill__ok"]}>Form submitted successfully!</div>
        )}
        {status === "error" && (
          <div className={styles["fill__err"]}>
            Please fill all inputs or check API.
          </div>
        )}
      </div>
    </div>
  );
}
