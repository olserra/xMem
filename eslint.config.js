export default {
  // ...existing config
  ignores: [
    'node_modules',
    '.next',
    'dist',
    'out',
    'coverage',
    'build',
    '**/*.d.ts',
    '**/*.test.*',
    'src/generated/prisma/**',
    'src/generated/prisma/runtime/**',
  ],
  // ...rest of your config
}; 