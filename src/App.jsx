// Components
import PublicLayout from "./components/PublicLayout";

// Router
import { Navigate, Route, Routes } from "react-router";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Transfer from "./pages/Transfer";
import ProtectedLayout from "./components/ProtectedLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { TransactionProvider } from "./contexts/TransactionContext";
import TransactionList from "./pages/TransactionList";

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/transfer" replace />} />

          <Route
            path="/login"
            element={
              <PublicLayout>
                <LoginPage />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout>
                <RegisterPage />
              </PublicLayout>
            }
          />
          <Route
            path="/transfer"
            element={
              <ProtectedLayout>
                <Transfer />
              </ProtectedLayout>
            }
          />

          <Route
            path="/transfer"
            element={
              <ProtectedLayout>
                <TransactionList />
              </ProtectedLayout>
            }
          />
        </Routes>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;
