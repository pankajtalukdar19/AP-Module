export const config = {
  backendUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5050",
  apiUrl: import.meta.env.VITE_API_BASE_API_URL || "http://localhost:5050/api",
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,

} as const;
