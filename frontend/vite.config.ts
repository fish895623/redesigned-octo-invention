import { defineConfig, loadEnv, type ConfigEnv, type UserConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // Load env variables but don't store them since we don't use them
  loadEnv(mode, process.cwd(), '');

  // Check if we're running in analyze mode
  const isAnalyze = mode === 'analyze';

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Add visualizer plugin in analyze mode
      ...(isAnalyze
        ? [
            visualizer({
              open: true,
              filename: 'dist/stats.html',
              gzipSize: true,
              brotliSize: true,
            }),
          ]
        : []),
      // Copy build output from dist to Spring Boot's static folder
      viteStaticCopy({
        targets: [
          {
            src: 'dist/**/*',
            dest: '../../src/main/resources/static'
          },
        ],
        hook: 'writeBundle',
      }),
    ] as PluginOption[],

    server: {
      port: 5173,
    },

    build: {
      // Generate source maps for production build if needed
      sourcemap: mode === 'development',

      // Configure minification
      minify: mode === 'production' ? 'terser' : false,
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },

      // Optimize chunk size
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            auth: ['./src/context/AuthContext.tsx'],
            ui: ['./src/components/ui/Navigation/NavigationBar.tsx'],
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },

      chunkSizeWarningLimit: 1000,
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    },

    css: {
      devSourcemap: true,
    },
  };
});
