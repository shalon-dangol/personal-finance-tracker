import { Routes, Route, Navigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Categories from "./pages/Categories";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppContext();
  if (isLoading) {
    return null;
  }
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppContext();
  if (isLoading) {
    return null;
  }
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route
          path="/"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
      </Route>

      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;