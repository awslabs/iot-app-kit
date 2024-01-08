import {
  GraphicComponentElementOption,
  GraphicComponentTextOption,
} from 'echarts/types/src/component/graphic/GraphicModel';
import {
  TREND_CURSOR_CLOSE_GRAPHIC_INDEX,
  TREND_CURSOR_HEADER_GRAPHIC_INDEX,
  TREND_CURSOR_LINE_GRAPHIC_INDEX,
} from '../../../constants';
import { setXWithBounds } from '../../../calculations/calculations';
import {
  ondragUpdateGraphicProps,
  ondragUpdateTrendCursorElementsProps,
} from '../../../types';
import { updateTrendCursorLineMarkers } from '../../../getTrendCursor/components/markers';
import { getTrendCursorHeaderTimestampText } from '../../../calculations/timestamp';
import { calculateSeriesMakers } from '../../../calculations/calculateSeriesMakers';

const onDragUpdateTrendCursorLine = (
  elements: GraphicComponentElementOption[]
) => {
  // specifically setting the line graphic x value to 0 so that it follows the parent's X
  const lineGraphic = elements[TREND_CURSOR_LINE_GRAPHIC_INDEX];
  lineGraphic.x = 0;
  return lineGraphic;
};
const onDragUpdateTrendCursorHeaderText = (
  elements: GraphicComponentElementOption[],
  timeInMs: number
) => {
  const headerGraphic = elements[TREND_CURSOR_HEADER_GRAPHIC_INDEX];
  headerGraphic.x = 0;

  const children = headerGraphic.children ?? [];
  const textGraphic = children.find((c) => c.type === 'text');
  const restGraphic = children.filter((c) => c.type !== 'text');
  if (!textGraphic) return headerGraphic;

  // update the timestamp on the header
  (textGraphic as GraphicComponentTextOption).style = {
    ...(textGraphic as GraphicComponentTextOption).style,
    text: getTrendCursorHeaderTimestampText(timeInMs),
  };

  return {
    ...headerGraphic,
    children: [textGraphic, ...restGraphic],
  };
};
export const onDragUpdateTrendCursorElements = ({
  elements,
  trendCursorsSeriesMakersInPixels,
  timeInMs,
}: ondragUpdateTrendCursorElementsProps) => {
  return [
    onDragUpdateTrendCursorLine(elements),
    onDragUpdateTrendCursorHeaderText(elements, timeInMs),
    ...updateTrendCursorLineMarkers(
      elements,
      trendCursorsSeriesMakersInPixels
    ).slice(TREND_CURSOR_CLOSE_GRAPHIC_INDEX, elements.length),
  ];
};
export const onDragUpdateTrendCursor = ({
  graphic,
  posX,
  timeInMs,
  series,
  size,
  chartRef,
  visualization,
  significantDigits,
}: ondragUpdateGraphicProps) => {
  // calculate the new Y for the series markers
  const { trendCursorsSeriesMakersInPixels, trendCursorsSeriesMakersValue } =
    calculateSeriesMakers(
      series,
      timeInMs,
      chartRef,
      visualization,
      significantDigits
    );

  // this section updates the internal data of graphic, this data is used to render the legend component data
  // update the X value of the TC
  graphic.x = setXWithBounds(size, posX);
  // add the timestamp to graphic for future use
  graphic.timestampInMs = timeInMs;
  graphic.yAxisMarkerValue = trendCursorsSeriesMakersValue;

  return {
    ...graphic,
    children: onDragUpdateTrendCursorElements({
      elements: graphic.children,
      trendCursorsSeriesMakersInPixels,
      timeInMs,
    }),
  };
};
