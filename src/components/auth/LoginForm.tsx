import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useAuth } from "../../hooks/useAuth";
import { Password } from "primereact/password";
import { Link } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "90vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-card p-3 gap-3"
        style={{ width: "95%", maxWidth: "400px" }}
      >
        {error && <Message severity="error" text={error} />}
        <div className="text-center my-5">
          <h2 className="text-3xl font-bold m-0 mb-4">Login</h2>
          <p className="text-600 mt-0 mb-4">Sign in to continue</p>
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            disabled={isLoading}
          />
        </div>
        <div className="field">
          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            feedback={false}
            className="w-full"
            inputClassName="w-full"
            disabled={isLoading}
            toggleMask
          />
        </div>

        <div>
          <Button
            type="submit"
            label="Login"
            loading={isLoading}
            disabled={!email || !password}
          />
        </div>
        <Link to="/forgot-password">Forgot Password?</Link>
      </form>
    </div>
  );
}

export default LoginForm;
