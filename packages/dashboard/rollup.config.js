import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import url from 'postcss-url';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import typescript from 'rollup-plugin-typescript2';

const packageJson = require('./package.json'); // eslint-disable-line

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        inlineDynamicImports: true,
      },
    ],
    plugins: [
      image(),
      tsConfigPaths(),
      peerDepsExternal({
        includeDependencies: true,
      }),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        tsconfigOverride: {
          exclude: [
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/*.spec.ts',
            '**/*.spec.tsx',
          ],
        },
      }),
      postcss({
        plugins: [
          url({
            url: 'inline', // enable inline assets using base64 encoding
            maxSize: 10, // maximum file size to inline (in kilobytes)
            fallback: 'copy', // fallback method to use if max size is exceeded
          }),
        ],
      }),
    ],
    // silence Tanstack Query related warning
    // see https://github.com/TanStack/query/issues/5175
    onwarn(warning, warn) {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
        return;
      }
      warn(warning);
    },
    external: ['react', 'react-dom'],
  },
];
