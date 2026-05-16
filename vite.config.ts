import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/constants': path.resolve(__dirname, './src/constants'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/config': path.resolve(__dirname, './src/config'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // API Gateway / Auth / Product Service (port 8080)
      '/api': {
        // target: 'https://ecommerce-api-gateway.kruzetech.dev',
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Order Service (port 8084) — /order-api/** → http://localhost:8084/**
      '/order-api': {
        target: 'http://localhost:8084',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/order-api/, '/api'),
      },
      // Payment Service (port 8085, context-path /api) — /payment-api/** → http://localhost:8085/api/**
      '/payment-api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/payment-api/, '/api'),
      },
      // Shipping Service (port 8088) — /shipping-api/** → http://localhost:8088/**
      '/shipping-api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/shipping-api/, '/api'),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
