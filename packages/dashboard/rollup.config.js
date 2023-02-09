import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import url from 'postcss-url';

const packageJson = require('./package.json'); // eslint-disable-line

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      nodePolyfills({ crypto: true }),
      peerDepsExternal(),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      json(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({
        plugins: [
          url({
            url: 'inline', // enable inline assets using base64 encoding
            maxSize: 10, // maximum file size to inline (in kilobytes)
            fallback: 'copy', // fallback method to use if max size is exceeded
          }),
        ],
      }),
      terser(),
    ],
    external: ['react', 'react-dom'],
  },
  {
    input: 'dist/cjs/dashboard/src/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'cjs' }],
    external: [/\.css$/],
    plugins: [dts()],
  },
];
