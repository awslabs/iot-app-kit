import { IntlCache, IntlShape, createIntl, createIntlCache } from 'react-intl';
import { StateCreator, create } from 'zustand';
import { mergedMessages } from './messages';

export interface IntlData {
  intl: IntlShape;
  cache: IntlCache;
}

export const intlSlice: StateCreator<IntlData> = () => {
  const cache = createIntlCache();

  const intl = createIntl(
    {
      locale: 'en',
      messages: mergedMessages.en,
    },
    cache
  );

  return {
    intl,
    cache,
  };
};

// intl instance store so that it can be used outside of a react context
export const useIntlStore = create<IntlData>()((...args) => ({
  ...intlSlice(...args),
}));
