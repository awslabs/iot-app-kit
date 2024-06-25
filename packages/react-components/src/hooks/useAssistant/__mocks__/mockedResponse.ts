import type { InvokeAssistantRequest, StreamingInvokeAssistantResponse } from './types';

// TODO: Temporary implementation for InvokeAssistant operation
export const FakeInvokeAssistant = async (
  _request: InvokeAssistantRequest
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
        citations: [
          {
            references: [
              {
                content: {
                  text: 'citation 1'
                }
              }
            ]
          }
        ]
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
