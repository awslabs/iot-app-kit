import { mockReactIntl } from './__mocks__/MockReactIntl';

window.URL.createObjectURL = jest.fn();

mockReactIntl();

export {};
