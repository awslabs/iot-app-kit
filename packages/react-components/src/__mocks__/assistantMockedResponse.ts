import { InvokeAssistantResponse, InvokeAssistantRequest, StreamingInvokeAssistantResponse } from "@iot-app-kit/core-util";

export const mockedInvokeAssistantResponse1:InvokeAssistantResponse = {
  trace: {
    traceId: 'step1',
    text: 'Analysing IoT Sitewise data ...',
  },
  finalResponse: {
    message: [],
  }
};
export const mockedInvokeAssistantResponse2:InvokeAssistantResponse = {
  trace: {
    traceId: 'step2',
    text: 'Generating a response ...',
  },
  finalResponse: {
    message: [],
  }
};

export const mockedInvokeAssistantResponse3:InvokeAssistantResponse = {
  finalResponse: {
    message: [
      {
        text: 'assistant response end',
      },
    ],
  },
}; 

export const mockedInvokeAssistantResponse4:InvokeAssistantResponse = {
  finalResponse: {
    message: [
      {
        text: `Looks like you want to know more about the potential root cause of the rising motor temperature.
        \n - Overloading: The motor is operating under a load higher than its rated capacity, causing it to overheat.
        \n - Insufficient Cooling: The cooling system is malfunctioning or blocked, preventing adequate heat dissipation.
        \n - Electrical Issues: Voltage spikes, phase imbalance, or poor insulation could lead to excessive heating.
        \n - Mechanical Failures: Worn bearings, misalignment, or other mechanical issues can increase friction and heat.`,
      },
    ],
    metadata: {
      "insights": `{
        "prompts": [
          "What are the recommendations?", "What is the prevention procedure?"
        ]
      }
      `
    },
    citations: [
      {
        references: [
          {
            content: {
              text: 'SOP documents',
            },
            location: {
              s3Location: {
                uri: 'https://mybucket.s3.amazonaws.com/sop.doc',
              },
              type: 'link',
            },
          },
        ],
      },
    ],
  },
};

export const mockedInvokeAssistantResponse5:InvokeAssistantResponse = {
  finalResponse: {
    message: [
      {
        text: `Based on the data, the first step I would recommend is to inspect the motor itself for any visible signs of wear or damage. You'll want to check the motor casing, fans, and any accessible components to see if there are any obvious issues. If everything looks okay there, I'd suggest checking the cooling system next - verify that the coolant levels are appropriate and that the fans/pumps are functioning properly.`,
      },
    ],
    citations: [
      {
        references: [
          {
            content: {
              text: 'SOP documents',
            },
            location: {
              s3Location: {
                uri: 'https://mybucket.s3.amazonaws.com/sop.doc',
              },
              type: 'link',
            },
          },
        ],
      },
    ],
  },
};




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
