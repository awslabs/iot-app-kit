import type { BaseStateManager, IMessage } from './types';
import { SenderType, MessageType } from './types';

const generateUniqueID = () => 'ID';

type GenericSetState<T> = (fn: (state: T) => T) => void;

export class StateManager<T> implements BaseStateManager {
  private setState: GenericSetState<T>;

  constructor(setStateFunc: GenericSetState<T>) {
    this.setState = setStateFunc;
  }

  addPartialResponse = (content: string, response: unknown) => {
    const message = {
      id: generateUniqueID(),
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
      id: generateUniqueID(),
      loading: true,
      content,
      sender: SenderType.ASSISTANT,
      type: MessageType.CITATION,
      payload: references,
    }

    this.addMessageToState(message);
  };

  addText = (content: string) => {
    const message = {
      id: generateUniqueID(),
      loading: false,
      content,
      sender: SenderType.ASSISTANT,
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
}

export default StateManager;
