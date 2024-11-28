import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@components/auth/ProtectedRoute";
import AuthLayout from "@components/layout/AuthLayout";
import DashboardLayout from "@components/layout/DashboardLayout";
import LoginForm from "@components/auth/LoginForm";
import DashboardPage from "@pages/dashboard/DashboardPage";
import Unauthorized from "./pages/errors/Unauthorized";
import NotFound from "./pages/errors/NotFound";
import ApplicationsPage from "./pages/admin/ApplicationsPage";
import ProfilePage from "./pages/vendors/ProfilePage";
import Settings from "./pages/admin/Settings";
import InterestPage from "./pages/admin/InterestPage";
import VendorsPage from "./pages/admin/VendorsPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import MyInterestPage from "./pages/vendors/MyInterestPage";
import MyApplicationPage from "./pages/vendors/MyApplicationPage";
import MyPaymentsPage from "./pages/vendors/MyPaymentsPage";
import ForgotPassword from "@components/auth/ForgotPassword";
import ResetPassword from "@components/auth/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {/* Vendor and Admin Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["vendor", "admin"]} />}>
          <Route index element={<DashboardPage />} />
        </Route>

        {/* Vendor Profile */}
        <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="my-application" element={<MyApplicationPage />} />
          <Route path="my-interest" element={<MyInterestPage />} />
          <Route path="my-payments" element={<MyPaymentsPage />} />
        </Route>

        {/* Admin Users */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="interest" element={<InterestPage />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
        </Route>
      </Route>

      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      {/* Error Pages */}
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="404" element={<NotFound />} />
    </Routes>
  );
}

export default App;
