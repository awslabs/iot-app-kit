import { ComponentInterface } from '@stencil/core';
import { noop } from 'lodash';
import { Position } from '../types';
import { distance } from '../util/distance';

export type PressEvents = 'press';

type PressTrigger = 'mouse' | 'touch' | 'all';
type PressTarget = 'parent' | 'self';
/**
 * Options to configure a press event handler
 *
 * @type PressOptions
 * @property {number} [duration=500] time in ms that a press needs to be held for before the event occurs.
 * @property {number} [threshold=5] distance the press pointer can move before cancelling the press event.
 * @property {'mouse' | 'touch' | 'all'} [trigger='touch'] the type of Pointer event that will trigger a press. Must be one of 'mouse' | 'touch' | 'all'
 * @property {'parent' | 'self'} [target='self'] the target the event will trigger from. Must be one of 'parent' | 'self'
 */
export type PressOptions = {
  duration?: number;
  threshold?: number;
  trigger?: PressTrigger;
  target?: PressTarget;
};

const defaultOptions: Required<PressOptions> = {
  duration: 500,
  threshold: 5,
  trigger: 'touch',
  target: 'self',
};

type EventTypess = {
  start: 'mousedown' | 'touchstart' | 'pointerdown';
  move: 'mousemove' | 'touchmove' | 'pointermove';
  end: 'mouseup' | 'touchend' | 'pointerup';
  cancel: 'touchcancel' | 'pointercancel' | null;
};

const getEvents = (trigger: PressTrigger): EventTypess => {
  switch (trigger) {
    case 'mouse':
      return {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup',
        cancel: null,
      };
    case 'touch':
      return {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend',
        cancel: 'touchcancel',
      };
    case 'all':
      return {
        start: 'pointerdown',
        move: 'pointermove',
        end: 'pointerup',
        cancel: 'pointercancel',
      };
  }
};

export const getEvent = (event: Event) =>
  (event as TouchEvent).touches ? (event as TouchEvent).touches[0] : (event as MouseEvent);

export const withPressHandler = (
  component: ComponentInterface,
  el: HTMLElement,
  options: PressOptions,
  cb: (event: Event) => void
): (() => void) => {
  let startPosition: Position | null = null;
  let pressTimeout: NodeJS.Timeout;

  const { duration, threshold, trigger, target } = Object.assign({}, defaultOptions, options);
  const targetElement = target === 'parent' ? el.parentElement : el;

  if (!targetElement) return noop;

  const { start, move, end, cancel } = getEvents(trigger);

  const reset = () => {
    startPosition = null;
    clearTimeout(pressTimeout);
  };

  const pressStartHandler = (event: Event) => {
    const ev = getEvent(event);
    if (!ev) return;
    startPosition = {
      x: ev.clientX,
      y: ev.clientY,
    };
    pressTimeout = setTimeout(() => {
      cb.call(component, event);
      reset();
    }, duration);
  };
  const pressEndHandler = (event: Event) => {
    if (!startPosition || event.type === 'mouseup' || event.type === 'pointerup') {
      reset();
      return;
    }
    const ev = getEvent(event);
    if (!ev) {
      reset();
      return;
    }

    const endPosition: Position = {
      x: ev.clientX,
      y: ev.clientY,
    };
    if (distance(startPosition, endPosition) > threshold) {
      reset();
      return;
    }
  };

  targetElement.addEventListener(start, pressStartHandler);
  targetElement.addEventListener(move, pressEndHandler);
  targetElement.addEventListener(end, pressEndHandler);
  if (cancel !== null) {
    targetElement.addEventListener(cancel, pressEndHandler);
  }

  return () => {
    targetElement.removeEventListener(start, pressStartHandler);
    targetElement.removeEventListener(move, pressEndHandler);
    targetElement.removeEventListener(end, pressEndHandler);
    if (cancel !== null) {
      targetElement.removeEventListener(cancel, pressEndHandler);
    }
  };
};
