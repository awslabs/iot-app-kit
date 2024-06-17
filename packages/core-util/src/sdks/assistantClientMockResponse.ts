import {
  InvokeAssistantRequest,
  InvokeAssistantResponse,
  ChatMessage,
  EventSummaryRequest,
} from './assistantTypes';

interface StreamingInvokeAssistantResponse {
  StatusCode: number;
  StreamReponse: AsyncIterable<InvokeAssistantResponse>;
}

// Temporary implementation for InvokeAssistantCommand
export class InvokeAssistantCommand {
  private input: InvokeAssistantRequest;
  /**
   * @public
   */
  constructor(_input: InvokeAssistantRequest) {
    this.input = _input;
  }

  public send(): Promise<StreamingInvokeAssistantResponse> {
    return new Promise((resolve) => {
      const response1 = {} as InvokeAssistantResponse;
      const response2 = {} as InvokeAssistantResponse;
      const response3 = {} as InvokeAssistantResponse;

      const asyncIterator = (async function* () {
        setTimeout(() => yield response1, 500);
        setTimeout(() => yield response2, 1000);
        setTimeout(() => yield response3, 1000);
      })();

      resolve({
        StatusCode: 200,
        StreamReponse: asyncIterator,
      });
    });
  }
}
