import copy from 'rollup-plugin-copy-assets';

export default {
  input: 'src/index.ts',
  output: {
    file: 'www',
    format: 'cjs',
  },
  plugins: [
    copy({
      assets: ['assets'],
    }),
  ],
};
