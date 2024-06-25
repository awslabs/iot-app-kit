import StateManager from './stateManager';
import { type IMessageParser, type BaseStateManager, SenderType } from './types';
import type { InvokeAssistantResponse } from '@iot-app-kit/core-util';

export class MessageParser implements IMessageParser {
  private stateManager: StateManager<any> = new StateManager(() => {});

  setStateManager(stateManager: BaseStateManager & StateManager<any>) {
    this.stateManager = stateManager;
  }

  parse(response: InvokeAssistantResponse) {
    
    if (response.step?.stepId) {
      this.stateManager.addPartialResponse(response.step.rationale.text, response.step);
    }

    if (response.response.citations) {
      response.response.citations.forEach((citation: Record<string, any>) => {
        this.stateManager.addCitations('', citation.references);
      });
    }

    if (response.response?.message?.content) {
      response.response?.message?.content.forEach((content: Record<string, any>) => {
        this.stateManager.addText(content.text, SenderType.ASSISTANT);
      })
    }

  }
}
