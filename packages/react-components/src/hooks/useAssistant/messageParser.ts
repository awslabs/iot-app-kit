import StateManager from './stateManager';
import type { IMessageParser } from './types';
import type { AssistantClientInvocationResponse } from '@iot-app-kit/core-util';

export class MessageParser implements IMessageParser {
  private stateManager: StateManager<any>;
  
  constructor(stateManager: StateManager<any>) {
    this.stateManager = stateManager;
  }

  parse(response: AssistantClientInvocationResponse) {
    
    if (response.body.step?.stepId) {

      this.stateManager.addPartialResponse(response.body.step.rationale.text, response.body.step);
    }

    if (response.body.response.citations) {
      response.body.response.citations.forEach((citation) => {
        this.stateManager.addCitations('', citation.references);
      });
    }

    if (response.body.response?.message?.content) {
      response.body.response?.message?.content.forEach((content) => {
        this.stateManager.addText(content.text);
      })
    }

  }
}
