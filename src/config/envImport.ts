export const env = {
  API_URL: import.meta.env.VITE_BACKEND_URI,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
} as const;