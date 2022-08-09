import { Config } from '@stencil/core';
import url from 'postcss-url';
import { postcss } from '@stencil/postcss';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import dotenvPlugin from 'rollup-plugin-dotenv';

export const config: Config = {
  testing: {
    setupFilesAfterEnv: ['<rootDir>/jestSetup.ts'],
  },
  plugins: [
    dotenvPlugin(),
    postcss({
      plugins: [
        url({
          url: "inline", // enable inline assets using base64 encoding
          maxSize: 10, // maximum file size to inline (in kilobytes)
          fallback: "copy", // fallback method to use if max size is exceeded
        }),
      ],
    }),
  ],
  namespace: 'iot-app-kit-dashboard',
  globalScript: './globalScript.js',
  rollupPlugins: {
    after: [
      nodePolyfills(),
    ]
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
