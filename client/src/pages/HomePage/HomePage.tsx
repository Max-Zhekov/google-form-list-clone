import { Link } from "react-router-dom";
import { useGetFormsQuery } from "../../app/api/formsApi";
import styles from "./HomePage.module.css";

export function HomePage() {
  const { data, isLoading, isError } = useGetFormsQuery();

  return (
    <div className={styles["home"]}>
      <header className={styles["home__header"]}>
        <h1 className={styles["home__title"]}>Forms</h1>
        <Link className={styles["home__create"]} to="/forms/new">
          Create New Form
        </Link>
      </header>

      {isLoading && <p className={styles["home__state"]}>Loading…</p>}
      {isError && (
        <p className={styles["home__state--error"]}>Error loading forms</p>
      )}

      <ul className={styles["home__list"]}>
        {data?.map((form) => (
          <li key={form.id} className={styles["home__item"]}>
            <div className={styles["home__item-title"]}>{form.title}</div>
            {form.description && (
              <div className={styles["home__item-desc"]}>
                {form.description}
              </div>
            )}
            <div className={styles["home__item-actions"]}>
              <Link to={`/forms/${form.id}/fill`}>View Form</Link>
              <Link to={`/forms/${form.id}/responses`}>View Responses</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
