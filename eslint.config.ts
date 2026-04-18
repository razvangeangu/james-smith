import path from 'node:path';
import { cwd } from 'node:process';

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: path.join(cwd(), 'tsconfig.json'),
        },
        node: {
          extensions: [
            '.js',
            '.jsx',
            '.cjs',
            '.mjs',
            '.ts',
            '.tsx',
            '.mts',
            '.cts',
            '.json',
          ],
        },
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\u0000'], ['^node:'], ['^@/', '^@messages/'], ['^']],
        },
      ],
      // Specifier-based only; `import/no-relative-parent-imports` false-positives on `@/` aliases.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^\\.\\./',
              message:
                'Use @/ instead of parent-relative imports. See tsconfig.json compilerOptions.paths.',
            },
            {
              regex: '^\\./',
              message:
                'Use @/ instead of same-directory relative imports. See tsconfig.json compilerOptions.paths.',
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
