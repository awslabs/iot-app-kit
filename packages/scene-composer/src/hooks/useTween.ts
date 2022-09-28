import { Easing, Interpolation, Group, Tween } from '@tweenjs/tween.js';
import { useEffect, useRef } from 'react';

interface TweenConfig<T extends object> {
  from: T;
  onUpdate: () => void;
  to: T;
  duration?: number;
  easing?: (amount: number) => number;
  interpolation?: (v: number[], k: number) => number;
  onComplete?: () => void;
}

const DEFAULT_TWEEN_DURATION_IN_MS = 500;
const DEFAULT_TWEEN_EASING = Easing.Cubic.Out;
const DEFAULT_TWEEN_INTERPOLATION = Interpolation.Bezier;

export function useTween<T extends object>(): [(...tweenConfigs: TweenConfig<T>[]) => void, () => void] {
  const group = useRef<Group>();

  function setTween(...tweenConfigs: TweenConfig<T>[]) {
    if (group.current) {
      tweenConfigs.forEach(
        ({
          from,
          to,
          onComplete,
          onUpdate,
          duration = DEFAULT_TWEEN_DURATION_IN_MS,
          easing = DEFAULT_TWEEN_EASING,
          interpolation = DEFAULT_TWEEN_INTERPOLATION,
        }) => {
          const tween = new Tween(from, group.current);
          tween.to(to, duration);
          tween.easing(easing);
          tween.interpolation(interpolation);
          tween.onComplete(() => {
            group.current?.remove(tween);
            onComplete && onComplete();
          });
          tween.onUpdate(() => onUpdate());
          tween.start();
        },
      );
    }
  }

  function updateTween() {
    group.current?.update();
  }

  useEffect(() => {
    group.current = new Group();
    return () => group.current?.removeAll();
  }, []);

  return [setTween, updateTween];
}
