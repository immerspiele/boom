import { defineConfig } from 'tsup';

export default defineConfig({
  outDir: 'dist',
  entry: {
    signal: 'src/signal/index.ts',
    screen: 'src/screen/index.ts'
  },
  clean: true,
  treeshake: true,
  sourcemap: true,
  platform: 'browser',
  dts: true,
  format: ['cjs', 'esm'],
});
