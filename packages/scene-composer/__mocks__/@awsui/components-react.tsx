import mockComponent from '../mockComponent';

const polarisRaw = jest.createMockFromModule('@awsui/components-react');

const polaris = Object.keys(polarisRaw).reduce((acc, comp) => {
  if (!comp.startsWith('_')) {
    acc[comp] = mockComponent(comp);
  } else {
    acc[comp] = polarisRaw[comp];
  }
  return acc;
}, {});

module.exports = {
  ...polaris,
};
