import '@testing-library/jest-dom';

window.URL.createObjectURL = vi.fn();
// Cannot find module 'react-cytoscapejs' error will be thrown without this mock
vi.mock('@iot-app-kit/react-components', () => ({ useViewport: vi.fn().mockReturnValue({ viewport: undefined }) }));
