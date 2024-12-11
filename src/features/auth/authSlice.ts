import { RootState } from "@/store";
import { User } from "@/types/user.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,

  token: localStorage.getItem("token") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        state.token = action.payload;
        localStorage.setItem("token", action.payload);
      }
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        state.refreshToken = action.payload;
        localStorage.setItem("refreshToken", action.payload);
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.clear();
    },
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const selectAccessToken = (state: RootState) => state.auth.token;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectUser = (state: RootState) => state.auth.user;

export const { setUser, clearAuth, setToken, setRefreshToken } =
  authSlice.actions;

export default authSlice.reducer;
