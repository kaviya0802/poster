import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,      // starting port
    strictPort: false // automatically find next free port if in use
  },
});
