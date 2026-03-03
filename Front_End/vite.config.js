import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite dev/build configuration for the React frontend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
