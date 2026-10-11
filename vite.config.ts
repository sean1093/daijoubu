import { defineConfig } from "vite";

export default defineConfig({
  // Relative asset URLs. Routing lives entirely in the hash, so the built site
  // works from any GitHub Pages subpath without hard-coding the repo name.
  base: "./",
  build: {
    // Each country edition is served from its own path; the root page
    // (site/index.html) is copied in by `npm run build`.
    outDir: "dist/japan",
    emptyOutDir: true,
  },
});
