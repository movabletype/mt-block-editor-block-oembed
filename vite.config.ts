import { defineConfig } from "vite";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  build: {
    outDir: "docs/dist",
    emptyOutDir: true,
    lib: {
      entry: "src/index.ts",
      name: "MTBlockEditorBlockOembed",
      fileName: () => "mt-block-editor-block-oembed.js",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["tinymce"],
      output: {
        globals: {
          tinymce: "tinymce",
        },
        assetFileNames: "mt-block-editor-block-oembed.[ext]",
      },
    },
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        // eslint-disable-next-line camelcase
        drop_console: true,
      },
    },
  },
  plugins: [
    svgLoader({
      defaultImport: "url",
    }),
  ],
  css: {
    modules: {},
  },
  server: {
    open: "docs/index.html",
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "mt-block-editor-block",
  },
});
