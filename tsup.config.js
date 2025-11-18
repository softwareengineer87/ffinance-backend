import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/infra/fastify/server.ts'], // Main entry point only
  format: ['cjs'], // CommonJS format
  target: 'es2016',
  clean: true,
  minify: false,
  sourcemap: false,
  loader: {
    '.sql': 'text' // Handle SQL files as text
  },
  external: [
    // Mark these as external to avoid bundling issues
    'whatsapp-web.js',
    'qrcode-terminal'
  ],
  // Exclude test files and specs from the build
  ignoreWatch: ['src/tests/**/*', '**/*.spec.ts', '**/*.test.ts'],
  esbuildOptions(options) {
    options.platform = 'node'
    options.target = 'es2016'
  }
})
