import React, { useEffect, useState } from 'react';
import { defaultsDeep } from 'lodash';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';

import useLogger from '../../logger/react-logger/hooks/useLogger';
import { defaultMessages, messagesMap } from '../../../translations';

const DEFAULT_LOCALE = 'en-US';

const Provider = ({ locale, children }) => {
  const log = useLogger('IntlProvider');
  const stringLogger = log?.extend('[MISSINGTRANSLATION]');
  const [messages, setMessages] = useState(defaultMessages);
  const [loc, setLoc] = useState('');

  useEffect(() => {
    log?.verbose('i18nFeature is enabled! Detected locale: ', locale);
    setLoc(locale || DEFAULT_LOCALE);
  }, []);

  useEffect(() => {
    if (loc !== '') {
      let lang = loc;
      if (!(lang in messagesMap)) lang = lang.split('-')[0];
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
