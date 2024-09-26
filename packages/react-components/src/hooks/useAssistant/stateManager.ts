import type { ResponseStream } from '@amzn/iot-black-pearl-internal-v3';
import type { BaseStateManager, IMessage, UniqueID } from './types';
import { MessageType } from './types';
import { v4 as uuidv4 } from 'uuid';
import { AssistantInvocationRequest } from '@iot-app-kit/core-util';

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

  addPartialResponse = (originComponentId: UniqueID, content: string) => {
    const message = {
      id: uuidv4(),
      originComponentId,
      loading: true,
      content,
      sender: 'assistant',
      type: MessageType.TEXT,
    } satisfies IMessage;

    this.addMessageToState(message);
  };

  addText = (
    originComponentId: UniqueID,
    content: string,
    sender: 'user' | 'assistant',
    payload?: ResponseStream
  ) => {
    const message = {
      id: uuidv4(),
      originComponentId,
      loading: false,
      content,
      sender,
      type: MessageType.TEXT,
      payload,
    };

    this.addMessageToState(message);
  };

  addPrompts = (originComponentId: UniqueID, payload: string[]) => {
    const message = {
      id: uuidv4(),
      originComponentId,
      loading: false,
      content: '',
      sender: 'assistant',
      type: MessageType.PROMPTS,
      payload,
    } satisfies IMessage;

    this.addMessageToState(message);
  };

  addError = (payload: AssistantInvocationRequest, content: string) => {
    const message = {
      id: uuidv4(),
      originComponentId: payload.componentId,
      loading: false,
      content,
      sender: 'assistant',
      type: MessageType.ERROR,
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
