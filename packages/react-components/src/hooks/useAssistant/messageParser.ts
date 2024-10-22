import type { ResponseStream } from '@amzn/iot-black-pearl-internal-v3';
import type { IMessage, IMessageParser, UniqueID } from './types';
import type { AssistantInvocationRequest } from '@iot-app-kit/core-util';
import { MessageType } from './types';
import { v4 as uuidv4 } from 'uuid';

export class MessageParser implements IMessageParser {
  getPartialResponse = (originComponentId: UniqueID, content: string) => {
    return {
      id: uuidv4(),
      originComponentId,
      loading: true,
      content,
      sender: 'assistant',
      type: MessageType.TEXT,
      generatedByAi: true,
    } satisfies IMessage;
  };

  getText = (
    originComponentId: UniqueID,
    content: string,
    sender: 'user' | 'assistant',
    payload?: ResponseStream
  ) => {
    return {
      id: uuidv4(),
      originComponentId,
      loading: false,
      content,
      sender,
      type: MessageType.TEXT,
      payload,
      generatedByAi: sender === 'assistant',
    };
  };

  getError = (payload: AssistantInvocationRequest, content: string) => {
    return {
      id: uuidv4(),
      originComponentId: payload.componentId,
      loading: false,
      content,
      sender: 'assistant',
      type: MessageType.ERROR,
      payload,
      generatedByAi: true,
    } satisfies IMessage;
  };

  getPrompts = (originComponentId: UniqueID, payload: string[]) => {
    return {
      id: uuidv4(),
      originComponentId,
      loading: false,
      content: '',
      sender: 'assistant',
      type: MessageType.PROMPTS,
      payload,
      generatedByAi: true,
    } satisfies IMessage;
  };

  parse(request: AssistantInvocationRequest, response: ResponseStream) {
    const messages = [];
    if (response.trace?.text) {
      messages.push(
        this.getPartialResponse(request.componentId, response.trace?.text || '')
      );
    }

    if (response.output?.message?.length) {
      messages.push(
        this.getText(
          request.componentId,
          response.output?.message,
          'assistant',
          response
        )
      );
    }

    return messages;
  }
}
