import { isNumeric, round } from './number';

describe.each`
  value           | expected
  ${'test'}       | ${false}
  ${new Date()}   | ${false}
  ${NaN}          | ${false}
  ${'NaN'}        | ${false}
  ${Infinity}     | ${true}
  ${-Infinity}    | ${true}
  ${+Infinity}    | ${true}
  ${'Infinity'}   | ${true}
  ${'-Infinity'}  | ${true}
  ${'+Infinity'}  | ${true}
  ${0}            | ${true}
  ${-0}           | ${true}
  ${+0}           | ${true}
  ${123.2312}     | ${true}
  ${+123.2312}    | ${true}
  ${-123.2312}    | ${true}
  ${-123.23e2}    | ${true}
  ${+123.23e2}    | ${true}
  ${+123.23e-2}   | ${true}
  ${'0'}          | ${true}
  ${'-0'}         | ${true}
  ${'+0'}         | ${true}
  ${'123.2312'}   | ${true}
  ${'+123.2312'}  | ${true}
  ${'-123.2312'}  | ${true}
  ${'23e2'}       | ${true}
  ${'23.23e2'}    | ${true}
  ${'-123.23e2'}  | ${true}
  ${'-123.23e+2'} | ${true}
  ${'-123.23e-2'} | ${true}
  ${'+123.23e2'}  | ${true}
  ${'+123.23e-2'} | ${true}
  ${'+123.23e+2'} | ${true}
`('should return true if value is numeric', ({ value, expected }) => {
  test(`isNumeric(${value}) => ${expected}`, () => {
    expect(isNumeric(value)).toBe(expected);
  });
});

describe.each`
  value                 | preciseValue
  ${0.00345678}         | ${0.003457}
  ${0.02345678}         | ${0.02346}
  ${1.02345678}         | ${1.0235}
  ${10.02345678}        | ${10.0235}
  ${1}                  | ${1}
  ${1.0}                | ${1}
  ${1.2}                | ${1.2}
  ${1.29}               | ${1.29}
  ${1.129}              | ${1.129}
  ${1000.1234}          | ${1000.1234}
  ${1000.12345}         | ${1000.1235}
  ${1000.02345}         | ${1000.0235}
  ${1000.003456}        | ${1000.0035}
  ${1000.000056}        | ${1000.0001}
  ${891289.000056}      | ${891289.0001}
  ${28.910800000000002} | ${28.9108}
  ${-0.00345678}        | ${-0.003457}
  ${-0.02345678}        | ${-0.02346}
  ${-1.0}               | ${-1}
  ${-1.2}               | ${-1.2}
  ${-1.29}              | ${-1.29}
  ${-1.129}             | ${-1.129}
  ${-1000.1234}         | ${-1000.1234}
  ${-1000.12345}        | ${-1000.1235}
  ${-1000.02345}        | ${-1000.0235}
  ${-1000.003456}       | ${-1000.0035}
  ${-1000.000056}       | ${-1000.0001}
  ${-891289.000056}     | ${-891289.0001}
  ${NaN}                | ${NaN}
  ${Infinity}           | ${Infinity}
  ${-Infinity}          | ${-Infinity}
  ${-0}                 | ${0}
  ${0.0}                | ${0}
`('rounds number', ({ value, preciseValue }) => {
  test(`round(${value}) => ${preciseValue}`, () => {
    expect(round(value)).toBe(preciseValue);
  });
});
