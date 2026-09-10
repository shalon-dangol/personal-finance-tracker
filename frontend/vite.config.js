import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // 5173 is the default Vite port and matches the backend's CORS
    // allowlist (FRONTEND_URL) — changing it would break cookie/credentialed
    // requests in development.
    port: 5173,
    open: true,
  },
});
