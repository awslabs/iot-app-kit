import type { ResponseStream } from '@amzn/iot-black-pearl-internal-v3';
import type {
  AssistantStartAction,
  BaseStateManager,
  IMessage,
  UniqueID,
} from './types';
import { MessageType } from './types';
import { v4 as uuidv4 } from 'uuid';
import { AssistantInvocationRequest } from '@iot-app-kit/core-util';
import type { AssistantStateData } from '../../store/assistantSlice';

type GenericSetState = (state: AssistantStateData) => void;
type GenericGetState = () => AssistantStateData;
type GenericClearState = () => void;

export class StateManager implements BaseStateManager {
  private setStateFn: GenericSetState;
  private getStateFn: GenericGetState;
  private clearStateFn: GenericClearState;

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
    this.setStateFn({ messages: [message] } as AssistantStateData);
  };

  removeMessage = (index: number) => {
    const messages = [...this.getStateFn().messages];
    messages.splice(index, 1);
    this.clearStateFn();
    this.setStateFn({ messages } as AssistantStateData);
  };

  startComponentAction = ({
    target,
    componentId,
    action,
  }: AssistantStartAction) => {
    this.setStateFn({
      actions: {
        [componentId]: {
          target,
          action,
        },
      },
    } as AssistantStateData);
  };

  clearComponentActions = (componentId: string) => {
    const { actions } = this.getStateFn();
    if (actions[componentId]) {
      delete actions[componentId];
    }
    this.setStateFn({ actions } as AssistantStateData);
  };

  getState = () => this.getStateFn();

  setState = (state: AssistantStateData) => this.setStateFn(state);

  clearState = () => this.clearStateFn();
}
