import 'jest-styled-components';

window.URL.createObjectURL = jest.fn();
// Cannot find module 'react-cytoscapejs' error will be thrown without this mock
jest.mock('@iot-app-kit/react-components', () => ({ useViewport: jest.fn().mockReturnValue({ viewport: undefined }) }));

export {};
