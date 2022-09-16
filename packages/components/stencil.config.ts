import { Config } from '@stencil/core';
import replace from '@rollup/plugin-replace';

const { existsSync } = require('fs');

const credentials = (() => {
  if (existsSync('./creds.json')) {
    const {
      credentials: { accessKeyId, secretAccessKey, sessionToken },
    } = require('./creds.json');

    return {
      'process.env.AWS_ACCESS_KEY_ID': JSON.stringify(accessKeyId),
      'process.env.AWS_SECRET_ACCESS_KEY': JSON.stringify(secretAccessKey),
      'process.env.AWS_SESSION_TOKEN': JSON.stringify(sessionToken),
    };
  }
})();

export const config: Config = {
  namespace: 'iot-app-kit-components',
  globalStyle: 'src/styles/global.css',
  testing: {
    moduleNameMapper: {
      '@iot-app-kit/core': '<rootDir>/../../packages/core/src',
      '@iot-app-kit/related-table': '<rootDir>/../../packages/related-table/src',
      '^@awsui/?(components-react|design-tokens)': '<rootDir>/__mocks__/moduleMock.js',
      'd3-array': '<rootDir>/../../node_modules/d3-array/dist/d3-array.min.js',
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
    replace(credentials),
  ],
};
