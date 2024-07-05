import type { InvokeAssistantResponse } from '@iot-app-kit/core-util';

type UniqueID = string;

export enum SenderType {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  prompts = 'prompts',
  CITATION = 'citation',
  VIDEO = 'video',
  AUDIO = 'audio',
}

export interface IMessage {
  sender: SenderType;
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
  payload?: unknown;
}

export interface IMessageParser {
  parse(response: InvokeAssistantResponse): void;
  setStateManager(stateManager: BaseStateManager): void;
}

export interface BaseStateManager {
  addMessageToState: (message: IMessage) => void;
}
