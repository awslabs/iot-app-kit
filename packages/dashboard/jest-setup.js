import '@testing-library/jest-dom';
import { server } from './src/msw/server';
import 'jest-webgl-canvas-mock-v2';
import { TextDecoder, TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

beforeAll(() => {
  disableLogging();
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

/** Disable logging during tests to keep the test runner clean. Comment out lines as needed. */
function disableLogging() {
  // console.error = () => {};
  // console.info = () => {};
  // console.log = () => {};
  // console.table = () => {};
  // console.warn = () => {};
}
