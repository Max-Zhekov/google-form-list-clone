import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage/HomePage";
import { FormBuilderPage } from "./pages/FormBuilderPage/FormBuilderPage";
import { FormFillerPage } from "./pages/FormFillerPage/FormFillerPage";
import { FormResponsesPage } from "./pages/FormResponsesPage/FormResponsesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/forms/new" element={<FormBuilderPage />} />
      <Route path="/forms/:id/fill" element={<FormFillerPage />} />
      <Route path="/forms/:id/responses" element={<FormResponsesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
