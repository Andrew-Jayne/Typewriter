import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const inlineFavicon = () => {
  return {
    name: "inline-favicon",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const svg = readFileSync(resolve(import.meta.dirname, "src/icons/favicon.svg"));
        const uri = `data:image/svg+xml;base64,${svg.toString("base64")}`;
        return html.replace(/(<link rel="icon"[^>]*href=")[^"]*"/, `$1${uri}"`);
      },
    },
  };
};

export default defineConfig(() => {
  return {
    plugins: [viteSingleFile(), inlineFavicon()],
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
