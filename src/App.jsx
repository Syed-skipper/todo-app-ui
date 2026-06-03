import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Cards from "./pages/Cards";
import Budgets from "./pages/Budgets";
import Insights from "./pages/Insights";
import FamilyMembers from "./pages/FamilyMembers";
import Settlements from "./pages/Settlements";
import Statements from "./pages/Statements";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/family-members" element={<FamilyMembers />} />
          <Route path="/settlements" element={<Settlements />} />
          <Route path="/statements" element={<Statements />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
