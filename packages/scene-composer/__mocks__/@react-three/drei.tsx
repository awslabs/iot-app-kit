import mockComponent from '../mockComponent';

const dreiRaw: any = jest.createMockFromModule('@react-three/drei');

const drei = Object.keys(dreiRaw).reduce((acc, comp) => {
  if (!comp.startsWith('_')) {
    acc[comp] = mockComponent(comp);
  } else {
    acc[comp] = dreiRaw[comp];
  }
  return acc;
}, {});

module.exports = {
  ...drei,
};
