const awsCredentialsDefaultFormat = '{ "accessKeyId": "", "secretAccessKey": "", "sessionToken": "" }';
const awsCredentials = process.env.awsCredentials
  ? JSON.parse(process.env.awsCredentials)
  : JSON.parse(awsCredentialsDefaultFormat);

export const parameters = {
  // actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en-US',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'de-DE', right: '🇩🇪', title: 'Germany (DE)' },
        { value: 'en-UK', right: '🇬🇧', title: 'English (UK)' },
        { value: 'en-US', right: '🇺🇸', title: 'English (US)' },
        { value: 'es-ES', right: '🇪🇸', title: 'Spanish (ES)' },
        { value: 'fr-FR', right: '🇫🇷', title: 'French (FR)' },
        { value: 'id-ID', right: '🇮🇩', title: 'Indonesian (ID)' },
        { value: 'it-IT', right: '🇮🇹', title: 'Italian (IT)' },
        { value: 'ja-JP', right: '🇯🇵', title: 'Japanese (JP)' },
        { value: 'ko-KR', right: '🇰🇷', title: 'Korean (KR)' },
        { value: 'pt-BR', right: '🇵🇹', title: 'Portuguese (BR)' },
        { value: 'zh-CN', right: '🇨🇳', title: 'Chinese (CN)' },
        { value: 'zh-TW', right: '🇹🇼', title: 'Taiwanese (CN)' },
      ],
    },
  },
};

export const argTypes = {
  sceneSource: {
    options: ['local', 'aws'],
    control: 'inline-radio',
    table: { category: 'Source' },
  },
  dataSource: {
    options: ['local', 'aws'],
    control: 'inline-radio',
    table: { category: 'Source' },
  },
  awsCredentials: {
    table: { category: 'AWS' },
    control: {
      description: `Using profile "${process.env.AWS_PROFILE}`,
    },
  },
  awsRegion: {
    table: { category: 'AWS' },
    control: 'text',
  },
};

export const args = {
  sceneSource: !!awsCredentials ? 'aws' : 'local',
  dataSource: !!awsCredentials ? 'aws' : 'local',
  awsCredentials: awsCredentials,
};
