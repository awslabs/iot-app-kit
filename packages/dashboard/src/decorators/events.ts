import { ComponentInterface, getElement } from '@stencil/core';
import { noop } from 'lodash';

import { PressEvents, PressOptions, withPressHandler } from './press';

// Inspiration:
// https://medium.com/stencil-tricks/stenciljs-creating-custom-decorators-d4d8e78c5717
// https://www.npmjs.com/package/stencil-click-outside

type EventDecorator = (target: ComponentInterface, propertyKey: string) => void;

type EventerEvent = PressEvents;
type EventerOptions = PressOptions;

export function CustomEvent(event: EventerEvent, opts?: EventerOptions): EventDecorator {
  return (proto: ComponentInterface, methodName: string) => {
    const { connectedCallback, disconnectedCallback } = proto;

    let unsubscribe: () => void = noop;

    proto.connectedCallback = function () {
      const host = getElement(this);
      const method = this[methodName];

      switch (event) {
        case 'press':
          unsubscribe = withPressHandler(this, host, opts as PressOptions, method);
          break;
      }

      return connectedCallback && connectedCallback.call(this);
    };

    proto.disconnectedCallback = function () {
      unsubscribe();
      return disconnectedCallback && disconnectedCallback.call(this);
    };
  };
}
