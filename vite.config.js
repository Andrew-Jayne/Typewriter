import { resolve } from "node:path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig(() => {
  return {
    plugins: [viteSingleFile()],
    resolve: {
      alias: {
        "@": resolve(import.meta.dirname, "src"),
      },
    },
    server: {
      port: 1977,
      strictPort: true,
      allowedHosts: ["*"],
    },
    build: {
      minify: false,
    },
  };
});
