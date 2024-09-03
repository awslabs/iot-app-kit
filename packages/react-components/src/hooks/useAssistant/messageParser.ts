import type { ResponseStream } from '@amzn/iot-black-pearl-internal-v3';
import { StateManager } from './stateManager';
import type { IMessageParser, BaseStateManager } from './types';

export class MessageParser implements IMessageParser {
  private stateManager: StateManager = new StateManager(
    () => {},
    () => {},
    () => {}
  );

  setStateManager(stateManager: BaseStateManager & StateManager) {
    this.stateManager = stateManager;
  }

  parse(response: ResponseStream) {
    if (response.trace?.text) {
      this.stateManager.addPartialResponse(response.trace?.text || '');
    }

    if (response.output?.message?.length) {
      this.stateManager.addText(
        response.output?.message,
        'assistant',
        response
      );
    }
  }
}
