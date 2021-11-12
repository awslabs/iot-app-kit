import { Config } from '@stencil/core';
import { credentials } from './creds.json';
import replace from '@rollup/plugin-replace';

export const config: Config = {
  namespace: 'iot-app-kit-components',
  globalStyle: 'src/styles.css',
  testing: {
    moduleNameMapper: {
      '@iot-app-kit/core': '<rootDir>/../../packages/core/src',
    },
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [
    // NOTE: Prefer to use npm package https://www.npmjs.com/package/rollup-plugin-dotenv and have it
    // read directly from a .env file, but unable to get `rollup-plugin-dotenv` working. more investigation required.
    replace({
      'process.env.AWS_ACCESS_KEY_ID': JSON.stringify(credentials.accessKeyId),
      'process.env.AWS_SECRET_ACCESS_KEY': JSON.stringify(credentials.secretAccessKey),
      'process.env.AWS_SESSION_TOKEN': JSON.stringify(credentials.sessionToken),
    }),
  ],
};
