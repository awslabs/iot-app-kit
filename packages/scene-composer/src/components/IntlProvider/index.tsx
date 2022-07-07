import React, { useEffect, useState } from 'react';
import { defaultsDeep } from 'lodash';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';

import useLogger from '../../logger/react-logger/hooks/useLogger';
import { defaultMessages, messagesMap } from '../../../translations';
import { getGlobalSettings } from '../../GlobalSettings';
import { COMPOSER_FEATURES } from '../../interfaces';

const DEFAULT_LOCALE = 'en-US';

const Provider = ({ locale, children }) => {
  const log = useLogger('IntlProvider');
  const stringLogger = log?.extend('[MISSINGTRANSLATION]');
  const [messages, setMessages] = useState(defaultMessages);
  const [loc, setLoc] = useState('');
  const i18nFeatureEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.i18n];

  useEffect(() => {
    if (i18nFeatureEnabled) {
      log?.verbose('i18nFeature is enabled! Detected locale: ', locale);
      setLoc(locale || DEFAULT_LOCALE);
    } else {
      log?.verbose(
        `i18nFeature is not enabled, ignoring browser locale "${locale}" and using "${DEFAULT_LOCALE}" instead`,
      );
      setLoc(DEFAULT_LOCALE);
    }
  }, [i18nFeatureEnabled]);

  useEffect(() => {
    if (loc !== '') {
      let lang = loc.replace(/-/, '_');
      if (!(lang in messagesMap)) lang = lang.replace(/_\w+$/, '');
      const strings = messagesMap[lang];
      defaultsDeep(strings, defaultMessages);
      setMessages(strings);
    } else {
      setMessages(defaultMessages);
    }
  }, [loc]);

  return (
    <IntlProvider
      locale={loc}
      messages={messages as unknown as Record<string, string>}
      onError={(err) => stringLogger?.error(err as any as string)}
    >
      {children}
    </IntlProvider>
  );
};
Provider.propTypes = {
  children: PropTypes.node.isRequired,
  locale: PropTypes.string,
};
export default Provider;
