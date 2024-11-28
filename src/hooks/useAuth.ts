import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import {
  setUser,
  clearAuth,
  setToken,
  setRefreshToken,
} from "../features/auth/authSlice";
import type { LoginRequest } from "../types/auth.types";

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({ email, password }: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.login({ email, password });

      dispatch(setToken(response.data.data.accessToken));
      dispatch(setRefreshToken(response.data.data.refreshToken));
      dispatch(setUser(response.data.data.user));

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    dispatch(clearAuth());
    navigate("/login");
  };

  return {
    login,
    logout,
    isLoading,
    error,
  };
}
