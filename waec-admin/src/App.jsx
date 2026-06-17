import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pins from "./pages/Pins";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <div className="loading-text">Loading...</div>;
  if (!admin) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="pins" element={<Pins />} />
      <Route path="transactions" element={<Transactions />} />
      <Route path="users" element={<Users />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </Routes>
);

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
