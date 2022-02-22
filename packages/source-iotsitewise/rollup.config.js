import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'esm',
      },
    ],
    plugins: [typescript({ tsconfig: './tsconfig.json' })],
  },
  {
    input: 'src/__mocks__/index.ts',
    output: [
      {
        file: './dist/testing/index.js',
        format: 'cjs',
      },
    ],
    plugins: [typescript({ tsconfig: './tsconfig.json' })],
  },
];
