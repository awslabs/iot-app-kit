const strings = require('../translations/IotAppKitSceneComposer.en_US.json');

const reactIntl = jest.requireActual('react-intl');
type Message = {
  note: string;
  text: string;
};

const messages = Object.entries(strings).reduce((acc, [key, msg]: [key: string, msg: any]) => {
  acc[key] = msg.text;
  return acc;
}, {});

const intl = new reactIntl.createIntl({
  locale: 'en',
  messages
});

module.exports = {
  ...reactIntl,
  useIntl: jest.fn(() => intl),
};
