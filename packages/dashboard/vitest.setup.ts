import { server } from '@iot-app-kit/data-mocked/server';
import '@testing-library/jest-dom';

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
