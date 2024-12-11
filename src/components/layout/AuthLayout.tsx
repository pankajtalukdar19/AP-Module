import { useAppSelector } from "@/hooks/reduxHook";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function AuthLayout() {
  const { token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return (
    <div style={{ minHeight: "100vh" }} className="p-3">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
