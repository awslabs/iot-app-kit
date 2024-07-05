import { InvokeAssistantRequest, StreamingInvokeAssistantResponse } from "@iot-app-kit/core-util";

export const mockedInvokeAssistantResponse1 = {
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
export const mockedInvokeAssistantResponse2 = {
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

export const mockedInvokeAssistantResponse3 = {
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

// TODO: Temporary implementation for InvokeAssistant operation
export const MockInvokeAssistant = async (
  _request: InvokeAssistantRequest
): Promise<StreamingInvokeAssistantResponse> => {
  return new Promise((resolve) => {
    

    const asyncIterator = (async function* () {
      yield mockedInvokeAssistantResponse1;
      yield mockedInvokeAssistantResponse2;
      yield mockedInvokeAssistantResponse3;
    })();

    resolve({
      StatusCode: 200,
      StreamResponse: asyncIterator,
    });
  });
};
