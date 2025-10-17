import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Jetset - AI Travel Planning",
        short_name: "Jetset",
        description: "AI-powered travel planning app",
        theme_color: "#3BACE3",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/src/assets/adaptive-icon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/src/assets/adaptive-icon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
      },
    }),
  ],
  base: "/",
  publicDir: "public",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    port: 3000,
    open: true,
  },
});
