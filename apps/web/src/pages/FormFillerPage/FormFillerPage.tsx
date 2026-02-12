import { useParams } from "react-router-dom";
import { useGetFormQuery } from "../../app/api/formsApi";

export function FormFillerPage() {
  const { id } = useParams();
  const formId = id ?? "";
  const { data, isLoading, isError } = useGetFormQuery(formId, {
    skip: !formId,
  });

  if (!formId) return <div style={{ padding: 24 }}>No id</div>;
  if (isLoading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (isError) return <div style={{ padding: 24 }}>Error</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>{data?.title}</h2>
      <pre>{JSON.stringify(data?.questions, null, 2)}</pre>
    </div>
  );
}
