import { BaseChangeDetail } from '@cloudscape-design/components/input/interfaces';
import { numberFromDetail } from './inputEvent';
import { NonCancelableCustomEvent } from '@cloudscape-design/components/internal/events';

const mockEventDetail = (
  value: BaseChangeDetail['value']
): NonCancelableCustomEvent<BaseChangeDetail> => ({
  detail: { value },
  initCustomEvent: function (): void {
    throw new Error('Function not implemented.');
  },
  bubbles: false,
  cancelBubble: false,
  cancelable: false,
  composed: false,
  currentTarget: null,
  defaultPrevented: false,
  eventPhase: 0,
  isTrusted: false,
  returnValue: false,
  srcElement: null,
  target: null,
  timeStamp: 0,
  type: '',
  composedPath: function (): EventTarget[] {
    throw new Error('Function not implemented.');
  },
  initEvent: function (): void {
    throw new Error('Function not implemented.');
  },
  stopImmediatePropagation: function (): void {
    throw new Error('Function not implemented.');
  },
  stopPropagation: function (): void {
    throw new Error('Function not implemented.');
  },
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3,
});

it('returns a number from a detail event', () => {
  expect(numberFromDetail(mockEventDetail(''))).toBe(0);
  expect(numberFromDetail(mockEventDetail('1'))).toBe(1);
  expect(numberFromDetail(mockEventDetail('1.25'))).toBe(1);
  expect(numberFromDetail(mockEventDetail('-1.25'))).toBe(-1);
});
