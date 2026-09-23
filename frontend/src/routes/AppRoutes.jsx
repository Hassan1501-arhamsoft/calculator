import { Routes, Route } from "react-router-dom";
import CalculatorPage from "../features/calculator/pages/CalculatorPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CalculatorPage />} />
    </Routes>
  );
}
