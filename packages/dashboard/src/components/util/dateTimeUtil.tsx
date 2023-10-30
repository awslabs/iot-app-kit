// Format Date object to get date and time to display MM/DD/YY HH:MM:SS format
export const getFormattedDateTime = (rawDate: Date) => {
  const date = rawDate.getMonth() + 1 + '/' + rawDate.getDate() + '/' + rawDate.getFullYear().toString().slice(-2);
  const time = rawDate.toTimeString().split(' ')[0];
  const dateTime = date + ' ' + time;
  return dateTime;
};
