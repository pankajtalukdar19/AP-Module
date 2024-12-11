import { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { authApi } from "@api/auth.api";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Password reset link sent to your email",
      });
      setEmail("");
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to process request",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <Toast ref={toast} />
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
        <h2 className="text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-column gap-3">
            <div className="flex flex-column gap-2">
              <label htmlFor="email">Email</label>
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button label="Send Reset Link" loading={loading} type="submit" />
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
