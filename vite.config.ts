import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    server: {
      port: 3001,
      open: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: !isProduction,
      rollupOptions: {
        external: isProduction ? ['@tanstack/react-query-devtools'] : [],
      },
      commonjsOptions: {
        include: /node_modules/,
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env': {}
    },
    optimizeDeps: {
      include: ['@tanstack/react-query'],
      exclude: isProduction ? ['@tanstack/react-query-devtools'] : []
    }
  }
})
