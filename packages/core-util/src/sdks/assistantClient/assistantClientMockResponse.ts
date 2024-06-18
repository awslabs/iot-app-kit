import {
  InvokeAssistantRequest,
  InvokeAssistantResponse,
  ChatMessage,
  EventSummaryRequest,
} from './assistantTypes';

interface StreamingInvokeAssistantResponse {
  StatusCode: number;
  StreamResponse: AsyncIterable<InvokeAssistantResponse>;
}

// TODO: Temporary implementation for InvokeAssistant operation
export const FakeInvokeAssistant = async (
  request: InvokeAssistantRequest
): Promise<StreamingInvokeAssistantResponse> => {
  return new Promise((resolve) => {
    const response1 = {
      step: {
        stepId: 'step1',
        rationale: {
          text: 'contains the reasoning of the agent given the user input',
        },
        toolInvocation: {
          toolName: 'toolName',
          toolInputsJson: 'toolInputsJson',
        },
        observation: {
          toolOutputsJson: 'toolOutputsJson',
          response: 'response',
        },
      },
      response: {
        message: {
          content: [
            {
              text: 'assistant response',
            },
          ],
        },
      },
    };
    const response2 = {
      step: {
        stepId: 'step2',
        rationale: {
          text: 'contains the reasoning of the agent given the user input',
        },
        toolInvocation: {
          toolName: 'toolName',
          toolInputsJson: 'toolInputsJson',
        },
        observation: {
          toolOutputsJson: 'toolOutputsJson',
          response: 'response',
        },
      },
      response: {
        message: {
          content: [
            {
              text: 'assistant response 2',
            },
          ],
        },
      },
    };
    const response3 = {
      step: {
        stepId: 'end',
        rationale: {
          text: 'contains the reasoning of the agent given the user input',
        },
        toolInvocation: {
          toolName: 'toolName',
          toolInputsJson: 'toolInputsJson',
        },
        observation: {
          toolOutputsJson: 'toolOutputsJson',
          response: 'response',
        },
      },
      response: {
        message: {
          content: [
            {
              text: 'assistant response end',
            },
          ],
        },
      },
    };

    const asyncIterator = (async function* () {
      await sleep(500);
      yield response1;
      await sleep(1000);
      yield response2;
      await sleep(2000);
      yield response3;
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
