import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useAuth } from "../../hooks/useAuth";
import { Password } from "primereact/password";

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
        flexDirection: "column",
        minHeight: "90vh",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div className="text-center my-5">
        <h2 className="text-3xl font-bold m-0 mb-4">Login</h2>
        <p className="text-600 mt-0 mb-4">Sign in to continue</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-column gap-3"
        style={{ width: "95%", maxWidth: "400px" }}
      >
        <div className="p-float-label">
          <InputText
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            disabled={isLoading}
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className="p-float-label">
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
          <label htmlFor="password">Password</label>
        </div>

        {error && <Message severity="error" text={error} />}
        <Button
          type="submit"
          label="Login"
          loading={isLoading}
          disabled={!email || !password}
        />
      </form>
    </div>
  );
}

export default LoginForm;
