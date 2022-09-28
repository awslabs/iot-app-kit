import mockComponent from '../mockComponent';

const awsuiRaw: any = jest.createMockFromModule('@awsui/components-react');

const awsui = Object.keys(awsuiRaw).reduce((acc, comp) => {
  if (!comp.startsWith('_')) {
    acc[comp] = mockComponent(comp);
  } else {
    acc[comp] = awsuiRaw[comp];
  }
  return acc;
}, {});

module.exports = {
  ...awsui,
};
