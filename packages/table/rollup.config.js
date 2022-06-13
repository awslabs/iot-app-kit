import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';
import css from 'rollup-plugin-import-css';

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
    plugins: [typescript({ tsconfig: './tsconfig.json' }), css()],
  },
];
