import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React core into its own chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split animation library (heavy) separately for caching
          'motion-vendor': ['motion/react'],
          // Split icons separately (used everywhere, cache-friendly)
          'lucide-vendor': ['lucide-react'],
          // Split Radix UI components
          'radix-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          // Split charting library used only in Dashboard
          'charts-vendor': ['recharts'],
          // Split Supabase client
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
  },
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
