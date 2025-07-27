import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 3001,
      open: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      rollupOptions: {
        // Ensure all dependencies are bundled
        external: [],
      },
    },
    // This makes the environment variables available in the client
    define: {
      'process.env.NODE_ENV': `"${mode}"`,
      'process.env': {}
    },
  }
})
