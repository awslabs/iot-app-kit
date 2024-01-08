import { Animator, MS_PER_FRAME } from './animate';

describe(Animator, () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    // @ts-expect-error mockRestore does not exist on raf
    window.requestAnimationFrame.mockRestore();
    jest.clearAllTimers();
  });

  it('executes the animation at 60fps', () => {
    jest
      .spyOn(window, 'requestAnimationFrame')
      // @ts-expect-error number is not a timeout
      .mockImplementation((cb) => setTimeout(() => cb(), MS_PER_FRAME + 1));
    const animator = new Animator();
    const animation = jest.fn();

    animator.animate(animation);

    expect(animation).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(animation).toHaveBeenCalledTimes(1);

    animator.animate(animation);

    jest.runAllTimers();

    expect(animation).toHaveBeenCalledTimes(2);
  });

  it('does not execute the animation faster than 60fps', () => {
    const lessThan60fps = MS_PER_FRAME - 1;
    jest
      .spyOn(window, 'requestAnimationFrame')
      // @ts-expect-error number is not a timeout
      .mockImplementation((cb) => setTimeout(() => cb(), lessThan60fps));
    const animator = new Animator();
    const animation = jest.fn();

    animator.animate(animation);

    expect(animation).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(animation).not.toHaveBeenCalled();
  });
});
