export interface User {
  _id: string;
  role: "admin" | "vendor";
  phoneNumber: string;
  name?: string;
  avatarUrl?: string;
  email?: string;
}

export interface UserPayload {
  name?: string;
  email?: string;
  phoneNumber?: string;
}

export interface UpdateParams {
  id: string;
  payload: UserPayload;
}
