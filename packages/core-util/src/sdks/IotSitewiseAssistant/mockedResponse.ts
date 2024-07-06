import type {
  InvokeAssistantRequest,
  StreamingInvokeAssistantResponse,
} from './types';

// TODO: Temporary implementation for InvokeAssistant operation
export const MockInvokeAssistant = async (
  _request: InvokeAssistantRequest
): Promise<StreamingInvokeAssistantResponse> => {
  return new Promise((resolve) => {
    const response1 = {
      trace: {
        traceId: 'step1',
        text: 'contains information about the intermediate step',
      },
      finalResponse: {
        message: [
          {
            text: 'assistant response',
          },
        ],
      },
    };
    const response2 = {
      trace: {
        traceId: 'step2',
        text: 'contains information about the intermediate step part 2',
      },
      finalResponse: {
        message: [
          {
            text: 'assistant response 2',
          },
        ],
      },
    };
    const response3 = {
      finalResponse: {
        message: [
          {
            text: 'assistant response end',
          },
        ],
        metadata: {
          context: '{"assetId": "assetId1", "properties": ["propertyId1"]}',
        },
      },
    };

    const asyncIterator = (async function* () {
      yield response1;
      yield response2;
      yield response3;
    })();

    resolve({
      StatusCode: 200,
      StreamResponse: asyncIterator,
    });
  });
};
