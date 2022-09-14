import { toDataType } from './toDataType';

it('should return BOOLEAN', () => {
  expect(toDataType('BOOLEAN')).toEqual('BOOLEAN');
});

it('should return STRING', () => {
  expect(toDataType('STRING')).toEqual('STRING');
});

it('should return NUMBER by default', () => {
  expect(toDataType('NUMBER')).toEqual('NUMBER');
  expect(toDataType('DOUBLE')).toEqual('NUMBER');
  expect(toDataType('INTEGER')).toEqual('NUMBER');
  expect(toDataType(undefined)).toEqual('NUMBER');
});
