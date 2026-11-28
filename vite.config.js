import { readFileSync, renameSync } from "node:fs";
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

const stampVersion = () => {
  const pkg = JSON.parse(readFileSync(resolve(import.meta.dirname, "package.json"), "utf8"));
  return {
    name: "stamp-version",
    transformIndexHtml(html) {
      return html.replace("{{version}}", pkg.version);
    },
  };
};

const renameOutput = () => {
  let outDir = "dist";
  return {
    name: "rename-output",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle: {
      order: "post",
      handler() {
        renameSync(resolve(outDir, "index.html"), resolve(outDir, "typewriter.html"));
      },
    },
  };
};

export default defineConfig(() => {
  return {
    plugins: [viteSingleFile(), inlineFavicon(), stampVersion(), renameOutput()],
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
      modulePreload: { polyfill: false },
    },
  };
});
