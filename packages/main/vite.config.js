import {node} from '../../.electron-vendors.cache.json';
import {join} from 'path';
import {builtinModules} from 'module';
import excludeDependencies from '../../scripts/rollup-plugin-exclude';

const PACKAGE_ROOT = __dirname;


/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: [
      {
        find: '/@/',
        replacement: join(PACKAGE_ROOT, 'src') + '/',
      },
    ],
  },
  build: {
    sourcemap: 'inline',
    target: `node${node}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: [
        'electron',
        'electron-devtools-installer',
        'robotjs',
        'request',
        ...builtinModules.flatMap(p => [p, `node:${p}`]),
      ],
      output: {
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
  plugins: [
    excludeDependencies(['resolve-url', 'blueimp-load-image']),
  ],
};

export default config;
