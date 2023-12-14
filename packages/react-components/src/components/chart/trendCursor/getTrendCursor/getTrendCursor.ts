import { v4 as uuid } from 'uuid';
import { setXWithBounds } from '../calculations/calculations';
import { GetNewTrendCursorProps } from '../types';
import { addTCMarkers } from './components/markers';
import { addTCLine } from './components/line';
import { addTCHeader } from './components/header';
import { addTCDeleteButton } from './components/deleteButton';
import { calculateTimeStamp } from '../calculations/timestamp';
import { calculateSeriesMakers } from '../calculations/calculateSeriesMakers';

// this returns a Graphic element of Echarts (https://echarts.apache.org/en/option.html#graphic)
// A Trend cursor is a custom Graphic group element,
// which has a line and other elements which gets rendered on the screen.
// for now, we are storing the timestamp of the trend cursor in graphic element
// which will eventually be moved to state(redux)
export const getNewTrendCursor = ({
  e,
  size,
  series,
  tcId,
  x,
  timestamp,
  chartRef,
  visualization,
  significantDigits,
  color,
}: GetNewTrendCursorProps) => {
  const posX = e?.offsetX ?? x ?? 0;
  const uId = tcId ? tcId.split('trendCursor-')[1] : uuid();
  const timestampInMs = timestamp ?? calculateTimeStamp(posX, chartRef);
  const boundedX = setXWithBounds(size, posX);

  const { trendCursorsSeriesMakersValue, trendCursorsSeriesMakersInPixels } = calculateSeriesMakers(
    series,
    timestampInMs,
    chartRef,
    visualization,
    significantDigits
  );

  // this check makes sure that the chart lines are rendered first and only then we render the TC markers
  // this avoids the re-render issue because of changing key on change in query
  // without this check, we see that the TC's X will default to left and no markers
  if (trendCursorsSeriesMakersInPixels.every((v) => v === 0)) {
    return undefined;
  }
  // rotate the colors in a round-robin fashion
  return {
    id: tcId ?? `trendCursor-${uId}`,
    $action: 'merge' as const,
    type: 'group' as const,
    timestampInMs,
    yAxisMarkerValue: trendCursorsSeriesMakersValue,
    x: boundedX,
    color,
    // update the Y of the series markers
    //   childIndex --> purpose
    // -----------------------------
    //     0        --> line
    //     1        --> TC header
    //     2        --> close button
    // from index 3 --> series markers
    children: [
      addTCLine(uId, size),
      addTCHeader(uId, timestampInMs, color),
      addTCDeleteButton(uId),
      ...addTCMarkers(uId, trendCursorsSeriesMakersInPixels, series),
    ],
  };
};
