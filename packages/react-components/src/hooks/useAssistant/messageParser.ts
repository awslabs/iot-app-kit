import { StateManager } from './stateManager';
import type { IMessageParser, BaseStateManager } from './types';
import type { ResponseStreamChunk } from '@iot-app-kit/core-util';

export class MessageParser implements IMessageParser {
  private stateManager: StateManager = new StateManager(
    () => {},
    () => {},
    () => {}
  );

  setStateManager(stateManager: BaseStateManager & StateManager) {
    this.stateManager = stateManager;
  }

  parse(response: ResponseStreamChunk) {
    if (response.step?.stepId) {
      this.stateManager.addPartialResponse(
        response.step?.rationale?.text || ''
      );
    }

    if (response.finalResponse?.text?.length) {
      this.stateManager.addText(
        response.finalResponse?.text,
        'assistant',
        response
      );
    }
  }
}
