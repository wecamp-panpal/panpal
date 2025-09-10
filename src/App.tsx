import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import RecipePage from "./pages/recipe";

function Placeholder({ label }: { label: string }) {
  return (
    <div className="app-container" style={{ padding: "24px 0" }}>
      <h2 className="h-title" style={{ margin: 0 }}>{label}</h2>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Placeholder label="Home" />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/add" element={<Placeholder label="Add Recipe" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
