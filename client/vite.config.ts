import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      features: path.resolve(__dirname, "./src/features"),
      pages: path.resolve(__dirname, "./src/pages"),
      components: path.resolve(__dirname, "./src/components"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      assets: path.resolve(__dirname, "./src/assets"),
      app: path.resolve(__dirname, "./src/app"),
      util: path.resolve(__dirname, "./src/util"),
      routes: path.resolve(__dirname, "./src/routes"),
      layout: path.resolve(__dirname, "./src/layout"),
    },
  },

  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
});
