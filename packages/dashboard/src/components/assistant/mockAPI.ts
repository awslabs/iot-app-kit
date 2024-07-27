import {
  InvokeAssistantRequest,
  StreamingInvokeAssistantResponse,
} from '@iot-app-kit/core-util';
import {
  mockedInvokeAssistantResponse1,
  mockedInvokeAssistantResponse2,
  mockedInvokeAssistantResponse4,
  mockedInvokeAssistantResponse5,
} from './assistantMockedResponse';

// TODO: without msw for now, but change to msw in the future
export const MockInvokeAssistant = async (
  _request: InvokeAssistantRequest
): Promise<StreamingInvokeAssistantResponse> => {
  return new Promise((resolve) => {
    const asyncIterator = (async function* () {
      await sleep(2000);
      yield mockedInvokeAssistantResponse1;
      await sleep(2000);
      yield mockedInvokeAssistantResponse2;
      await sleep(2000);
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
