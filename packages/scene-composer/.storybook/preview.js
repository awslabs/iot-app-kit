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
      ]
    }
  }
}
