import {
  InvokeAssistantCommandInput,
  InvokeAssistantCommandOutput,
} from '@amzn/iot-black-pearl-internal-v3';
import {
  mockedInvokeAssistantResponse1,
  mockedInvokeAssistantResponse2,
  mockedInvokeAssistantResponse4,
  mockedInvokeAssistantResponse5,
} from '../../src/__mocks__/assistantMockedResponse';

// TODO: without msw for now, but change to msw in the future
export const MockInvokeAssistant = (
  params: InvokeAssistantCommandInput,
  _options?: unknown
): Promise<InvokeAssistantCommandOutput> => {
  return new Promise((resolve) => {
    const asyncIterator = (async function* () {
      await sleep(2000);
      yield mockedInvokeAssistantResponse1;
      await sleep(2000);
      yield mockedInvokeAssistantResponse2;
      await sleep(2000);
      if (params.message?.includes('root cause')) {
        yield mockedInvokeAssistantResponse4;
      } else {
        yield mockedInvokeAssistantResponse5;
      }
    })();

    resolve({
      conversationId: 'conversationId',
      body: asyncIterator,
      $metadata: {},
    } satisfies InvokeAssistantCommandOutput);
  });
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
