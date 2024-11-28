export const config = {
  backendUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5050",
  apiUrl: import.meta.env.VITE_API_BASE_API_URL || "http://localhost:5050/api",
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  moengageAppId:
    import.meta.env.VITE_MOENGAGE_APP_ID || "CUMSHFZ8YEOE4SCLOD0QT4A1",
} as const;
