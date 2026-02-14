import { Link, useParams } from "react-router-dom";
import { useGetFormQuery, useGetResponsesQuery } from "../../app/api/formsApi";
import { useFormResponses } from "../../hooks/useFormResponses";
import styles from "./FormResponsesPage.module.css";

export function FormResponsesPage() {
  const { id } = useParams();
  const formId = id ?? "";

  const formQ = useGetFormQuery(formId, { skip: !formId });
  const responsesQ = useGetResponsesQuery(formId, { skip: !formId });

  const views = useFormResponses(formQ.data, responsesQ.data);

  if (!formId) return <div className={styles["responses"]}>No id</div>;
  if (formQ.isLoading || responsesQ.isLoading)
    return <div className={styles["responses"]}>Loading…</div>;
  if (formQ.isError || !formQ.data)
    return <div className={styles["responses"]}>Form not found</div>;
  if (responsesQ.isError)
    return <div className={styles["responses"]}>Failed to load responses</div>;

  const form = formQ.data;

  return (
    <div className={styles["responses"]}>
      <header className={styles["responses__header"]}>
        <div>
          <h1 className={styles["responses__title"]}>{form.title}</h1>
          <div className={styles["responses__subtitle"]}>
            Responses: {views.length}
          </div>
        </div>

        <div className={styles["responses__actions"]}>
          <Link
            className={styles["responses__link"]}
            to={`/forms/${form.id}/fill`}>
            View Form
          </Link>
          <Link className={styles["responses__link"]} to={`/`}>
            Home
          </Link>
        </div>
      </header>

      {views.length === 0 ? (
        <div className={styles["responses__empty"]}>No responses yet.</div>
      ) : (
        <div className={styles["responses__list"]}>
          {views.map((r, idx) => (
            <section key={r.id} className={styles["responses__card"]}>
              <div className={styles["responses__cardhead"]}>
                <div className={styles["responses__cardtitle"]}>
                  Response #{views.length - idx}
                </div>
                <div className={styles["responses__meta"]}>
                  {new Date(r.createdAt).toLocaleString()}
                </div>
              </div>

              <div className={styles["responses__qa"]}>
                {r.answers.map((a) => (
                  <div key={a.questionId} className={styles["responses__row"]}>
                    <div className={styles["responses__q"]}>
                      {a.questionTitle}
                    </div>
                    <div className={styles["responses__a"]}>
                      {a.value || (
                        <span className={styles["responses__muted"]}>—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
