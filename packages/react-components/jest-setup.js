import '@testing-library/jest-dom';
import 'jest-canvas-mock';

import { TextDecoder, TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
