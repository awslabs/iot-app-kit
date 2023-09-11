import { useGridSettings } from '~/components/actions/useGridSettings';

export const useSizeInPixels = (width: number, height: number) => {
  const { cellSize } = useGridSettings();
  return { widthPx: width * cellSize, heightPx: height * cellSize };
};
