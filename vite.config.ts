import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [
    react(),
    viteSingleFile(),
  ],

  build: {
    target: "es2022",
    assetsInlineLimit: 100000000,
    modulePreload: false,
    cssCodeSplit: false,
    sourcemap: false,
  },

  server: {
    port: 5173,
    open: true,
  },
});
