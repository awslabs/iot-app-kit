type Animation = VoidFunction;

const FPS = 60;
export const MS_PER_FRAME = 1000 / FPS;

/**
 * Animate with JS at a maximum of 60 frames per second.
 */
export class Animator {
  #msPrev = window.performance.now();

  public animate(
    animation: Animation
  ): ReturnType<typeof requestAnimationFrame> {
    return requestAnimationFrame(() => {
      const msNow = window.performance.now();
      const msPassed = msNow - this.#msPrev;

      if (msPassed < MS_PER_FRAME) {
        return;
      }

      const excessTime = msPassed % MS_PER_FRAME;
      this.#msPrev = msNow - excessTime;

      animation();
    });
  }
}
