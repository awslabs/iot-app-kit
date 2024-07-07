import { StateManager } from './stateManager';
import {
  type IMessageParser,
  type BaseStateManager,
  SenderType,
} from './types';
import type { InvokeAssistantResponse } from '@iot-app-kit/core-util';

export class MessageParser implements IMessageParser {
  private stateManager: StateManager = new StateManager(
    () => {},
    () => {}
  );

  setStateManager(stateManager: BaseStateManager & StateManager) {
    this.stateManager = stateManager;
  }

  parse(response: InvokeAssistantResponse) {
    if (response.trace?.traceId) {
      this.stateManager.addPartialResponse(
        response.trace.text
      );
    }

    if (response.finalResponse?.citations) {
      response.finalResponse.citations.forEach((citation: Record<string, any>) => {
        this.stateManager.addCitations('', citation.references);
      });
    }

    if (response.finalResponse?.message?.length) {
      response.finalResponse?.message?.forEach(
        (content: Record<string, any>) => {
          this.stateManager.addText(content.text, SenderType.ASSISTANT);
        }
      );
    }
  }
}
