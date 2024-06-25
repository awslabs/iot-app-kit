import type { BaseStateManager, IMessage } from './types';
import { SenderType, MessageType } from './types';
import { v4 as uuidv4 } from 'uuid';

type GenericSetState<T> = (fn: (state: T) => T) => void;

export class StateManager<T> implements BaseStateManager {
  private setState: GenericSetState<T>;

  constructor(setStateFunc: GenericSetState<T>) {
    this.setState = setStateFunc;
  }

  addPartialResponse = (content: string, response: unknown) => {
    const message = {
      id: uuidv4(),
      loading: true,
      content,
      sender: SenderType.ASSISTANT,
      type: MessageType.TEXT,
      payload: response,
    }

    this.addMessageToState(message);
  };

  addCitations = (content: string, references: any[]) => {
    const message = {
      id: uuidv4(),
      loading: true,
      content,
      sender: SenderType.ASSISTANT,
      type: MessageType.CITATION,
      payload: references,
    }

    this.addMessageToState(message);
  };

  addText = (content: string, sender: SenderType) => {
    const message = {
      id: uuidv4(),
      loading: false,
      content,
      sender,
      type: MessageType.TEXT,
    }

    this.addMessageToState(message);
  };

  addMessageToState = (message: IMessage) => {
    this.setState((state: any) => ({
      ...state,
      messages: [...state.messages, message],
    }));
  };

  getState = (): { messages: IMessage[] } => {
    return {
      messages: [{
        id: uuidv4(),
        loading: true,
        content: 'test',
        sender: SenderType.ASSISTANT,
        type: MessageType.TEXT,
      }]
    }
  }
}

export default StateManager;
