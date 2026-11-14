import { Route, Routes } from "react-router";
import PublicationsPage from "./pages/PublicationsListPage";
import PublicationDetailPage from "./pages/PublicationDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicationsPage />} />
      <Route path="/publication/:id" element={<PublicationDetailPage />} />
    </Routes>
  );
}
