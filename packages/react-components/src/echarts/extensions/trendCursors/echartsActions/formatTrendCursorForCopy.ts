// formatting the copy data so that it paste-able in an Excel sheet
// \t adds a tab and \n add a new line
// this is in the format of
// TC timestamp
// Cop timestamp

import { TrendCursorModel } from '../model';
import { TrendCursorValue } from '../store';

// Series name : value
export const formatTrendCursorForCopy = (
  trendCursor: TrendCursorModel,
  trendCursorValues: TrendCursorValue[]
) => {
  const { date } = trendCursor;
  if (!date) {
    throw new Error('Trendcursor date invalid');
  }

  let output = `Trend cursor timestamp \t ${new Date(
    date
  ).toLocaleDateString()} ${new Date(date).toLocaleTimeString()} \n`;

  const currDate = new Date();
  output =
    output +
    `Copy timestamp \t ${currDate.toLocaleDateString()} ${currDate.toLocaleTimeString()} \n`;

  trendCursorValues.forEach(({ name, value }) => {
    output = output + `${name} \t ${value} \n`;
  });
  return output;
};
