// Format Date object to get date and time to display MM/DD/YY HH:MM:SS format
const formatDateTime = (rawDate: Date) => {
  const date =
    rawDate.getMonth() +
    1 +
    '/' +
    rawDate.getDate() +
    '/' +
    rawDate.getFullYear().toString().slice(-2);
  const time = rawDate.toTimeString().split(' ')[0];
  const dateTime = date + ' ' + time;
  return dateTime;
};

export const getFormattedDateTime = (rawDate: Date) => {
  return formatDateTime(rawDate);
};

export const getFormattedDateTimeFromEpoch = (
  epochSeconds: number | undefined
) => {
  if (!epochSeconds) return '';
  const rawDate = new Date(epochSeconds * 1000);
  return formatDateTime(rawDate);
};
