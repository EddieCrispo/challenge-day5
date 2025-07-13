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
import { Bounce, ToastContainer } from "react-toastify";
import DashboardPage from "./pages/DashboardPage";
import Profile from "./components/Profile";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />

      <AuthProvider>
        <TransactionProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

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
              path="/profile"
              element={
                <ProtectedLayout>
                  <Profile />
                </ProtectedLayout>
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
              path="/transaction"
              element={
                <ProtectedLayout>
                  <TransactionList />
                </ProtectedLayout>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <DashboardPage />
                </ProtectedLayout>
              }
            />
          </Routes>
        </TransactionProvider>
      </AuthProvider>
    </>
  );
}

export default App;
