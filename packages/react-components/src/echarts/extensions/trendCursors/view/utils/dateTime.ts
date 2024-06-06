import { formatDate } from '../../../../../components/timeZone';

export const getDateTime = (date: number) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formatedDate = formatDate(date, {
    timeZone: timeZone,
    pattern: 'dd/MM/yyyy HH:mm:ss',
  });
  return formatedDate;
};
