// Components
import PublicLayout from "./components/PublicLayout";

// Router
import { Navigate, Route, Routes } from "react-router";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Transfer from "./pages/Transfer";
import ProtectedLayout from "./components/ProtectedLayout";

function App() {
  return (
    <>
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
      </Routes>
    </>
  );
}

export default App;
