import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },

      manifest: {
        name: "Rainfall AI",
        short_name: "Rainfall AI",
        description: "AI-powered rainfall prediction and disaster alert system",
        theme_color: "#07111f",
        background_color: "#07111f",
        display: "standalone",
        start_url: "/",
        scope: "/",
      },
    }),
  ],
});