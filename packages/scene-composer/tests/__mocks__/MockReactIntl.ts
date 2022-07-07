export const mockReactIntl = () => {
  jest.doMock('react-intl', () => {
    const reactIntl = jest.requireActual('react-intl');
    const intl = reactIntl.createIntl({
      locale: 'en',
    });
    return {
      ...reactIntl,
      useIntl: () => intl,
    };
  });
};
