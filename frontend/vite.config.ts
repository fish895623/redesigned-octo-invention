import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // Load env variables but don't store them since we don't use them
  loadEnv(mode, process.cwd(), "");

  // Check if we're running in analyze mode
  const isAnalyze = mode === "analyze";

  return {
    plugins: [
      react(),
      // Add visualizer plugin in analyze mode
      ...(isAnalyze
        ? [
            visualizer({
              open: true,
              filename: "dist/stats.html",
              gzipSize: true,
              brotliSize: true,
            }),
          ]
        : []),
      tailwindcss(),
    ] as any,

    server: {
      port: 5173,
    },

    build: {
      // Generate source maps for production build
      sourcemap: mode === "development",

      // Configure minification
      minify: mode === "production" ? "terser" : false,
      terserOptions: {
        compress: {
          drop_console: mode === "production",
          drop_debugger: mode === "production",
        },
      },

      // Optimize chunk size
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            // Group components with similar functionality
            auth: ["./src/context/AuthContext.tsx"],
            ui: ["./src/components/NavigationBar.tsx"],
          },
          // Generate chunk filenames with content hashes for better caching
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
      },

      // Make sure chunks are at least 10kb
      chunkSizeWarningLimit: 1000,
    },

    // Optimize dependency pre-bundling
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom", "axios"],
    },

    // Enable CSS code splitting
    css: {
      devSourcemap: true,
    },
  };
});
