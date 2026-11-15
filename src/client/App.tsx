import { Route, Routes } from "react-router";
import PublicationsListPage from "./pages/PublicationsListPage";
import PublicationDetailPage from "./pages/PublicationDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicationsListPage />} />
      <Route path="/publication/:id" element={<PublicationDetailPage />} />
    </Routes>
  );
}
