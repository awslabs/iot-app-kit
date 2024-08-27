import type { ResponseStreamChunk } from '@iot-app-kit/core-util';
import type { BaseStateManager, IMessage } from './types';
import { MessageType } from './types';
import { v4 as uuidv4 } from 'uuid';

type GenericSetState = (state: any) => void;
type GenericGetState = () => any;
type GenericClearState = () => any;

export class StateManager implements BaseStateManager {
  private setStateFn: GenericSetState;
  private getStateFn: GenericGetState;
  private clearStateFn: GenericGetState;

  constructor(
    setStateFunc: GenericSetState,
    getStateFunc: GenericGetState,
    clearStateFn: GenericClearState
  ) {
    this.setStateFn = setStateFunc;
    this.getStateFn = getStateFunc;
    this.clearStateFn = clearStateFn;
  }

  setStateFns(
    setStateFunc: GenericSetState,
    getStateFunc: GenericGetState,
    clearStateFn: GenericClearState
  ) {
    this.setStateFn = setStateFunc;
    this.getStateFn = getStateFunc;
    this.clearStateFn = clearStateFn;
  }

  addPartialResponse = (content: string) => {
    const message = {
      id: uuidv4(),
      loading: true,
      content,
      sender: 'assistant',
      type: MessageType.TEXT,
    } satisfies IMessage;

    this.addMessageToState(message);
  };

  addText = (
    content: string,
    sender: 'user' | 'assistant',
    payload?: ResponseStreamChunk
  ) => {
    const message = {
      id: uuidv4(),
      loading: false,
      content,
      sender,
      type: MessageType.TEXT,
      payload,
    };

    this.addMessageToState(message);
  };

  addPrompts = (payload: string[]) => {
    const message = {
      id: uuidv4(),
      loading: false,
      content: '',
      sender: 'assistant',
      type: MessageType.PROMPTS,
      payload,
    } satisfies IMessage;

    this.addMessageToState(message);
  };

  addMessageToState = (message: IMessage) => {
    this.setStateFn({ messages: [message] });
  };

  removeMessage = (index: number) => {
    const messages = [...this.getStateFn().messages];
    messages.splice(index, 1);
    this.clearStateFn();
    this.setStateFn({ messages });
  };

  getState = () => this.getStateFn();

  setState = (state: any) => this.setStateFn(state);

  clearState = () => this.clearStateFn();
}
