import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [cloudflare()],
  environments: {
    // Vite 8.3 defaults every environment's `input` to index.html. The worker
    // environment then resolves index.html as a Text module, and the Cloudflare
    // plugin restarts the whole dev server on each index.html edit, which
    // kills the page reload. Point the worker environment at its real entry.
    soiwebsite: { input: "./worker/index.ts" },
  },
});
