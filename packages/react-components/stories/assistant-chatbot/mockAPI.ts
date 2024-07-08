import {
  InvokeAssistantRequest,
  StreamingInvokeAssistantResponse,
} from '@iot-app-kit/core-util';
import {
  mockedInvokeAssistantResponse1,
  mockedInvokeAssistantResponse2,
  mockedInvokeAssistantResponse4,
  mockedInvokeAssistantResponse5,
} from '../../src/__mocks__/assistantMockedResponse';

// TODO: without msw for now, but change to msw in the future
export const MockInvokeAssistant = async (
  _request: InvokeAssistantRequest
): Promise<StreamingInvokeAssistantResponse> => {
  return new Promise((resolve) => {
    const asyncIterator = (async function* () {
      sleep(2000);
      yield mockedInvokeAssistantResponse1;
      sleep(2000);
      yield mockedInvokeAssistantResponse2;
      if (_request.invocationInputs.messages[0].text.includes('root cause')) {
        yield mockedInvokeAssistantResponse4;
      } else {
        yield mockedInvokeAssistantResponse5;
      }
    })();

    resolve({
      StatusCode: 200,
      StreamResponse: asyncIterator,
    });
  });
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
