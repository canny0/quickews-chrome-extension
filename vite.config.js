import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  define: {
    __API_URL__: JSON.stringify("https://api-quickews.canny0.workers.dev"),
  },
  root: resolve(__dirname, "src"),
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        dashboard: resolve(__dirname, "src", "dashboard", "index.html"),
        settings: resolve(__dirname, "src", "settings", "index.html"),
        guide: resolve(__dirname, "src", "guide", "index.html"),
        background: resolve(__dirname, "src", "js", "background.js"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
