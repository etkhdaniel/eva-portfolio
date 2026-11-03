import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const pages = [
  "index",
  "about",
  "experience",
  "projects",
  "creatives",
  "contact",
  "cv",
  "gknow",
  "io-studio",
  "snapshots",
  "vietnam-december-2024",
  "new-york-2019",
  "europe-2018",
  "journal",
];

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page, resolve(import.meta.dirname, `${page}.html`)]),
      ),
    },
  },
});
