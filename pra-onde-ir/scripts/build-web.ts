/**
 * Empacota o motor determinístico para o navegador (B9).
 *
 * O mesmo TypeScript que roda no servidor vira `publico/motor.js`, cacheado pelo service
 * worker. Uma fonte de verdade clínica, dois ambientes de execução.
 */

import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('../', import.meta.url));

const resultado = await build({
  entryPoints: [`${raiz}apps/web/src/offline.ts`],
  bundle: true,
  format: 'iife',
  target: ['es2022'],
  platform: 'browser',
  outfile: `${raiz}apps/web/publico/motor.js`,
  minify: process.env.NODE_ENV === 'production',
  sourcemap: false,
  legalComments: 'none',
  // `node:crypto` só é usado no versionamento do prompt (camada 2), que não existe offline.
  external: ['node:crypto'],
  alias: {
    '@pra-onde-ir/protocolo': `${raiz}packages/protocolo/src/index.ts`,
    '@pra-onde-ir/motor': `${raiz}packages/motor/src/index.ts`,
  },
  banner: {
    js:
      '/* Pra Onde Ir — motor determinístico (camadas 1 e 3) embarcado para uso offline.\n' +
      '   Mesmo código do servidor. Ver packages/motor. */',
  },
  metafile: true,
});

const tamanho = Object.values(resultado.metafile.outputs)[0]?.bytes ?? 0;
console.log(`motor.js gerado — ${(tamanho / 1024).toFixed(1)} kB`);
