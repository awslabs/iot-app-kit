import { ComponentInterface } from '@stencil/core';
import { MouseClick } from '../types';

export type DragOptions = Record<string, never>;

const defaultOptions: Required<DragOptions> = {};

export type DragEvents = 'dragstart' | 'drag' | 'dragend';

type DragEvent = MouseEvent | TouchEvent | PointerEvent;

class DragManager {
  public state: 'idle' | 'dragstaged' | 'drag' = 'idle';

  private callbacks: {
    start?: (event: DragEvent) => void;
    move?: (event: DragEvent) => void;
    end?: (event: DragEvent) => void;
  } = {};

  private component: ComponentInterface;
  private el: HTMLElement;
  private options: DragOptions;

  private setupComplete = false;

  constructor(component: ComponentInterface, el: HTMLElement, options: DragOptions) {
    this.component = component;
    this.el = el;
    this.options = Object.assign({}, options, defaultOptions);
  }

  handleSetupDrag = (event: DragEvent) => {
    if (event instanceof PointerEvent && event.button !== MouseClick.Left) {
      return;
    }
    this.state = 'dragstaged';
    event.stopPropagation();
  };

  handleDragMove = (event: DragEvent) => {
    if (this.state === 'dragstaged') {
      this.state = 'drag';
      if (this.callbacks.start) {
        this.callbacks.start.call(this.component, event);
      }
    } else if (this.state === 'drag' && this.callbacks.move) {
      this.callbacks.move.call(this.component, event);
    }
    event.stopPropagation();
  };

  handleDragEnd = (event: DragEvent) => {
    if (this.state === 'drag' && this.callbacks.end) {
      this.callbacks.end.call(this.component, event);
    }
    this.state = 'idle';
    event.stopPropagation();
  };

  addStartHandler = (cb: (event: DragEvent) => void) => {
    this.callbacks.start = cb;
  };
  addMoveHandler = (cb: (event: DragEvent) => void) => {
    this.callbacks.move = cb;
  };
  addEndHandler = (cb: (event: DragEvent) => void) => {
    this.callbacks.end = cb;
  };

  setupListeners = (): (() => void) => {
    if (this.setupComplete) return () => {};

    this.el.addEventListener('pointerdown', this.handleSetupDrag);
    document.addEventListener('pointermove', this.handleDragMove);
    document.addEventListener('pointerup', this.handleDragEnd);

    this.setupComplete = true;

    return () => {
      DragManagerCache.delete(this.component);

      this.el.removeEventListener('pointerdown', this.handleSetupDrag);
      document.removeEventListener('pointermove', this.handleDragMove);
      document.removeEventListener('pointerup', this.handleDragEnd);
    };
  };
}

export const DragManagerCache = new Map<ComponentInterface, DragManager>();
const getOrSetManager = (component: ComponentInterface, el: HTMLElement, options: DragOptions): DragManager => {
  let manager = DragManagerCache.get(component);
  if (!manager) {
    manager = new DragManager(component, el, options);
    DragManagerCache.set(component, manager);
  }
  return manager;
};

export const withDragStartHandler = (
  component: ComponentInterface,
  el: HTMLElement,
  options: DragOptions,
  cb: (event: DragEvent) => void
): (() => void) => {
  const manager = getOrSetManager(component, el, options);
  manager.addStartHandler(cb);
  return manager.setupListeners();
};

export const withDragHandler = (
  component: ComponentInterface,
  el: HTMLElement,
  options: DragOptions,
  cb: (event: DragEvent) => void
): (() => void) => {
  const manager = getOrSetManager(component, el, options);
  manager.addMoveHandler(cb);
  return manager.setupListeners();
};

export const withDragEndHandler = (
  component: ComponentInterface,
  el: HTMLElement,
  options: DragOptions,
  cb: (event: DragEvent) => void
): (() => void) => {
  const manager = getOrSetManager(component, el, options);
  manager.addEndHandler(cb);
  return manager.setupListeners();
};
