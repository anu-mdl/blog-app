import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  {
    ignores: [
      // Build outputs
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',

      // Dependencies
      'node_modules/**',

      // Generated files
      '.eslintcache',
      '*.min.js',
      '*.bundle.js',

      // Tests
      'src/**/*.test.*',
      'src/**/*.spec.*',
      'src/**/__tests__/**',

      // Config files (optional - you might want to lint these)
      // "*.config.js",
      // "*.config.ts",

      // Cache and temp directories
      '.cache/**',
      'tmp/**',
      'temp/**',

      // IDE files
      '.vscode/**',
      '.idea/**',

      // OS files
      '.DS_Store',
      'Thumbs.db',

      // Logs
      '*.log',
      'logs/**',

      // Coverage reports
      'coverage/**',
      '.nyc_output/**',

      // Storybook
      'storybook-static/**',

      // Public assets (usually don't need linting)
      'public/**/*.js'

      // Any other specific folders you want to exclude
      // "docs/**",
      // "scripts/**",
    ]
  },

  ...compat.config({
    extends: ['plugin:@next/next/recommended', 'next/core-web-vitals'],
    plugins: ['@next/next'],
    rules: {
      'react/jsx-key': 'warn',
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-sync-scripts': 'error'
    }
  })
];

export default eslintConfig;
