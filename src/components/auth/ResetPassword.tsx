import { useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Password } from "primereact/password";
import { authApi } from "@api/auth.api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Passwords do not match",
      });
      return;
    }

    const token = searchParams.get("token");
    if (!token) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Invalid reset token",
      });
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword(token, password);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Password reset successful",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to reset password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <Toast ref={toast} />
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
        <h2 className="text-center mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-column gap-3">
            <div className="flex flex-column gap-2">
              <label htmlFor="password">New Password</label>
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                toggleMask
                required
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Password
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                toggleMask
                required
              />
            </div>
            <Button label="Reset Password" loading={loading} type="submit" />
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
