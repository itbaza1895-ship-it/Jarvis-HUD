import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // For GitHub Pages deployment, uncomment and set your repo name:
  // base: '/jarvis-hud/',
  
  server: {
    host: "::",
    port: 8080,
  },
  
  plugins: [
    react(),
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    // Optimize build for production
    target: 'esnext',
    minify: 'esbuild', // Use esbuild (faster than terser, no extra dependencies)
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'three': ['three'],
          'mediapipe': ['@mediapipe/tasks-vision'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', '@mediapipe/tasks-vision'],
  },
});
