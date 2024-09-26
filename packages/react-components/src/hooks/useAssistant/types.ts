import type { ResponseStream } from '@amzn/iot-black-pearl-internal-v3';
import type { AssistantInvocationRequest } from '@iot-app-kit/core-util';

export type UniqueID = string;

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  PROMPTS = 'prompts',
  ERROR = 'error',
}

export type IMessage = {
  sender: 'user' | 'assistant';
  /**
   * this may hold a stringified JSON object
   */
  content: string;
  /**
   * help to parse specific message types, like prompts and so on
   */
  type: MessageType;
  id: UniqueID;
  originComponentId?: UniqueID;
  loading?: boolean;
  /**
   * holds name of complex components like charts, sceneviwere and so on
   */
  componentName?: string;
  /**
   * the raw payload data returned from InvokeAssistant in case a custom component needs it
   */
  payload?: any;
};

export interface IMessageParser {
  parse(request: AssistantInvocationRequest, response: ResponseStream): void;
  setStateManager(stateManager: BaseStateManager): void;
}

export interface BaseStateManager {
  addMessageToState: (message: IMessage) => void;
}
