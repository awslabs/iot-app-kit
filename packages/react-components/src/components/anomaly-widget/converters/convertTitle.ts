import { ANOMALY_TITLE } from '../constants';
import { ConfigurationOptions } from '../hooks/types';

export const convertTitle = ({ title }: Pick<ConfigurationOptions, 'title'>) =>
  title && { ...ANOMALY_TITLE, text: title };
