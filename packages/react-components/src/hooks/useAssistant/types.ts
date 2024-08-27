import type { ResponseStreamChunk } from '@iot-app-kit/core-util';

type UniqueID = string;

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  PROMPTS = 'prompts',
  VIDEO = 'video',
  AUDIO = 'audio',
}

export interface IMessage {
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
  loading?: boolean;
  /**
   * holds name of complex components like charts, sceneviwere and so on
   */
  componentName?: string;
  /**
   * the raw payload data returned from InvokeAssistant in case a custom component needs it
   */
  payload?: any;
}

export interface IMessageParser {
  parse(response: ResponseStreamChunk): void;
  setStateManager(stateManager: BaseStateManager): void;
}

export interface BaseStateManager {
  addMessageToState: (message: IMessage) => void;
}
