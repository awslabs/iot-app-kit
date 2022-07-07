import AWS from 'aws-sdk';

function getCredentials() {
  const chain = new AWS.CredentialProviderChain([
    function () {
      return {
        accessKeyId: process.env.STORYBOOK_ACCESS_KEY_ID,
        secretAccessKey: process.env.STORYBOOK_SECRET_ACCESS_KEY,
        sessionToken: process.env.STORYBOOK_SESSION_TOKEN,
      };
    },
  ]);
  return chain.resolvePromise();
}

export const parameters = {
  // actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const loaders = [
  async () => ({
    awsCredentials: await getCredentials(),
  }),
];
