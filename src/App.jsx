// Components
import PublicLayout from "./components/PublicLayout";
import DarkModeToggle from "./components/DarkModeToggle";

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
import EditProfile from "./components/EditProfile";
import Insight from "./pages/Insight";

// Chart
import "../src/utils/chart";
import CategorizationPage from "./pages/CategorizationPage";

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
          <div className="fixed top-4 right-4 z-50">
            <DarkModeToggle />
          </div>
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
              path="/profile-edit"
              element={
                <ProtectedLayout>
                  <EditProfile />
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
              path="/insight"
              element={
                <ProtectedLayout>
                  <Insight />
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
              path="/categorization"
              element={
                <ProtectedLayout>
                  <CategorizationPage />
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
