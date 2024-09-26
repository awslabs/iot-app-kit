import type { ResponseStream } from '@amzn/iot-black-pearl-internal-v3';
import { StateManager } from './stateManager';
import type { IMessageParser, BaseStateManager } from './types';
import type { AssistantInvocationRequest } from '@iot-app-kit/core-util';

export class MessageParser implements IMessageParser {
  private stateManager: StateManager = new StateManager(
    () => {},
    () => {},
    () => {}
  );

  setStateManager(stateManager: BaseStateManager & StateManager) {
    this.stateManager = stateManager;
  }

  parse(request: AssistantInvocationRequest, response: ResponseStream) {
    if (response.trace?.text) {
      this.stateManager.addPartialResponse(
        request.componentId,
        response.trace?.text || ''
      );
    }

    if (response.output?.message?.length) {
      this.stateManager.addText(
        request.componentId,
        response.output?.message,
        'assistant',
        response
      );
    }
  }
}
