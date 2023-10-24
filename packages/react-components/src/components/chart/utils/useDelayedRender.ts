import { FRAMES_TO_SKIP } from '../trendCursor/constants';

export const delayedRender = ({
  waitForFrames = FRAMES_TO_SKIP,
  updateFunction,
}: {
  waitForFrames?: number;
  updateFunction: () => void;
}) => {
  let frameCount = 0;
  const update = () => {
    if (frameCount > waitForFrames) {
      frameCount = 0;
      updateFunction();
    } else {
      frameCount++;
      window.requestAnimationFrame(update);
    }
  };
  window.requestAnimationFrame(update);
};
