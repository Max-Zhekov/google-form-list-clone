import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateFormMutation } from "../../app/api/formsApi";
import { useFormBuilder } from "../../hooks/useFormBuilder";
import { mapQuestionsToGql } from "../../utils/mapQuestionsToGql";
import type {
  UiQuestionType,
  UiQuestion,
} from "../../types/uiQuestionType.types";
import styles from "./FormBuilderPage.module.css";

export function FormBuilderPage() {
  const navigate = useNavigate();
  const builder = useFormBuilder();
  const [createForm, { isLoading, isError }] = useCreateFormMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<UiQuestion[]>([]);

  const canSave = title.trim().length > 0;

  function add(type: UiQuestionType) {
    setQuestions((prev) => builder.addQuestion(prev, type));
  }

  async function onSave() {
    if (!canSave || isLoading) return;

    await createForm({
      title: title.trim(),
      description: description.trim() ? description.trim() : null,
      questions: mapQuestionsToGql(questions),
    }).unwrap();

    navigate("/", { replace: true });
  }

  return (
    <div className={styles["builder"]}>
      <header className={styles["builder__header"]}>
        <h1 className={styles["builder__title"]}>Create form</h1>
        <button
          className={styles["builder__save"]}
          disabled={!canSave || isLoading}
          onClick={() => void onSave()}>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </header>

      <section className={styles["builder__meta"]}>
        <label className={styles["builder__field"]}>
          <div className={styles["builder__label"]}>Title</div>
          <input
            className={styles["builder__input"]}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className={styles["builder__field"]}>
          <div className={styles["builder__label"]}>Description</div>
          <textarea
            className={styles["builder__textarea"]}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </section>

      <section className={styles["builder__actions"]}>
        <button className={styles["builder__btn"]} onClick={() => add("text")}>
          + Text
        </button>
        <button
          className={styles["builder__btn"]}
          onClick={() => add("multiple_choice")}>
          + Multiple Choice
        </button>
        <button
          className={styles["builder__btn"]}
          onClick={() => add("checkbox")}>
          + Checkboxes
        </button>
        <button className={styles["builder__btn"]} onClick={() => add("date")}>
          + Date
        </button>
      </section>

      <section className={styles["builder__list"]}>
        {questions.length === 0 && (
          <div className={styles["builder__empty"]}>
            Add a question to start
          </div>
        )}

        {questions.map((q) => (
          <div key={q.id} className={styles["builder__card"]}>
            <div className={styles["builder__card-head"]}>
              <div className={styles["builder__card-type"]}>{q.type}</div>

              <div className={styles["builder__card-controls"]}>
                <button
                  className={styles["builder__iconbtn"]}
                  onClick={() =>
                    setQuestions((p) => builder.removeQuestion(p, q.id))
                  }>
                  ✕
                </button>
              </div>
            </div>

            <label className={styles["builder__field"]}>
              <div className={styles["builder__label"]}>Question</div>
              <input
                className={styles["builder__input"]}
                value={q.title}
                onChange={(e) =>
                  setQuestions((p) =>
                    builder.patchQuestion(p, q.id, { title: e.target.value }),
                  )
                }
              />
            </label>

            <label className={styles["builder__checkbox"]}>
              <input
                type="checkbox"
                checked={q.required}
                onChange={(e) =>
                  setQuestions((p) =>
                    builder.patchQuestion(p, q.id, {
                      required: e.target.checked,
                    }),
                  )
                }
              />
              Required
            </label>

            {q.type === "text" && (
              <div className={styles["builder__grid2"]}>
                <label className={styles["builder__field"]}>
                  <div className={styles["builder__label"]}>Placeholder</div>
                  <input
                    className={styles["builder__input"]}
                    value={q.placeholder ?? ""}
                    onChange={(e) =>
                      setQuestions((p) =>
                        builder.patchQuestion(p, q.id, {
                          placeholder: e.target.value,
                        }),
                      )
                    }
                  />
                </label>

                <label className={styles["builder__field"]}>
                  <div className={styles["builder__label"]}>Max length</div>
                  <input
                    type="number"
                    className={styles["builder__input"]}
                    value={q.maxLength ?? ""}
                    onChange={(e) =>
                      setQuestions((p) =>
                        builder.patchQuestion(p, q.id, {
                          maxLength: e.target.value,
                        }),
                      )
                    }
                  />
                </label>
              </div>
            )}

            {(q.type === "multiple_choice" || q.type === "checkbox") && (
              <div className={styles["builder__options"]}>
                <div className={styles["builder__options-head"]}>
                  <div className={styles["builder__label"]}>Options</div>
                  <button
                    className={styles["builder__btn"]}
                    onClick={() =>
                      setQuestions((p) => builder.addOption(p, q.id))
                    }>
                    + Add option
                  </button>
                </div>

                {(q.options ?? []).map((opt, i) => (
                  <div
                    key={`${q.id}_${i}`}
                    className={styles["builder__option-row"]}>
                    <input
                      className={styles["builder__input"]}
                      value={opt}
                      onChange={(e) =>
                        setQuestions((p) =>
                          builder.updateOption(p, q.id, i, e.target.value),
                        )
                      }
                    />
                    <button
                      className={styles["builder__iconbtn"]}
                      onClick={() =>
                        setQuestions((p) => builder.removeOption(p, q.id, i))
                      }>
                      ✕
                    </button>
                  </div>
                ))}

                {q.type === "checkbox" && (
                  <div className={styles["builder__grid2"]}>
                    <label className={styles["builder__field"]}>
                      <div className={styles["builder__label"]}>
                        Min selected
                      </div>
                      <input
                        type="number"
                        className={styles["builder__input"]}
                        value={q.minSelected ?? ""}
                        onChange={(e) =>
                          setQuestions((p) =>
                            builder.patchQuestion(p, q.id, {
                              minSelected: e.target.value,
                            }),
                          )
                        }
                      />
                    </label>

                    <label className={styles["builder__field"]}>
                      <div className={styles["builder__label"]}>
                        Max selected
                      </div>
                      <input
                        type="number"
                        className={styles["builder__input"]}
                        value={q.maxSelected ?? ""}
                        onChange={(e) =>
                          setQuestions((p) =>
                            builder.patchQuestion(p, q.id, {
                              maxSelected: e.target.value,
                            }),
                          )
                        }
                      />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </section>

      {isError && (
        <p className={styles["builder__error"]}>Failed to save form</p>
      )}
    </div>
  );
}
