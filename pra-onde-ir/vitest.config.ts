import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@pra-onde-ir/protocolo': r('./packages/protocolo/src/index.ts'),
      '@pra-onde-ir/motor': r('./packages/motor/src/index.ts'),
      '@pra-onde-ir/ia': r('./packages/ia/src/index.ts'),
      '@pra-onde-ir/registro': r('./packages/registro/src/index.ts'),
      '@pra-onde-ir/passe': r('./packages/passe/src/index.ts'),
    },
  },
  test: {
    include: ['testes/**/*.test.ts'],
    environment: 'node',
  },
});
