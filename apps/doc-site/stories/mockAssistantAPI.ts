import {
  type InvokeAssistantCommandInput,
  type InvokeAssistantCommandOutput,
  type ResponseStream,
} from '@aws-sdk/client-iotsitewise';

export const mockedInvokeAssistantResponse1: ResponseStream = {
  trace: {
    traceId: 'trace1',
    text: 'Analysing IoT Sitewise data ...',
  },
};

export const mockedInvokeAssistantResponse2: ResponseStream = {
  trace: {
    traceId: 'trace2',
    text: 'Generating a response ...',
  },
};

export const mockedInvokeAssistantResponse3: ResponseStream = {
  output: {
    message: 'assistant response end',
  },
};

export const mockedInvokeAssistantResponse4: any = {
  output: {
    message: `Looks like you want to know more about the potential root cause of the rising motor temperature.
        \n - Overloading: The motor is operating under a load higher than its rated capacity, causing it to overheat.
        \n - Insufficient Cooling: The cooling system is malfunctioning or blocked, preventing adequate heat dissipation.
        \n - Electrical Issues: Voltage spikes, phase imbalance, or poor insulation could lead to excessive heating.
        \n - Mechanical Failures: Worn bearings, misalignment, or other mechanical issues can increase friction and heat.`,
    citations: [
      {
        content: {
          text: 'SOP documents',
        },
        reference: {
          dataset: {
            source: {
              location: {
                uri: 'https://mybucket.s3.amazonaws.com/sop.doc',
              },
            },
          },
        },
      },
    ],
  },
};

export const mockedInvokeAssistantResponse5: any = {
  output: {
    message: `## Summary of Asset and Property Details

**Asset Name:** Demo Turbine Asset 1
**Property Name:** Wind Speed
**Unit:** m/s

**Property Value Insights:**

The historical wind speed data from April 1, 2023, 00:01:00 UTC to 00:10:00 UTC shows some interesting trends. Over this 10-minute period, the average wind speed ranged from a low of 14.79 m/s at 00:01:00 to a high of 17.78 m/s at 00:08:00. The minimum wind speed during this time was 12.60 m/s, recorded at 00:01:00, while the maximum was 18.06 m/s, observed at 00:09:00. 

The data indicates that wind speeds were relatively stable in the first 6 minutes, hovering around 14-15 m/s. However, a noticeable increase occurred starting at 00:07:00, with the average wind speed jumping to over 17 m/s and remaining elevated through 00:10:00. Comparing the latest 00:10:00 reading of 15.67 m/s to the historical values, it appears to be on the lower end of the range observed so far. This suggests that the wind speeds may have started to decline after the peak between 00:07:00 and 00:09:00.
    `,
    citations: [
      {
        content: {
          text: 'SOP document 1',
        },
        reference: {
          dataset: {
            source: {
              location: {
                uri: 'https://mybucket.s3.amazonaws.com/sop.doc',
              },
            },
          },
        },
      },
      {
        content: {
          text: 'Another long SOP content with more than fifty characters',
        },
        reference: {
          dataset: {
            source: {
              location: {
                uri: 'https://mybucket.s3.amazonaws.com/sop.doc',
              },
            },
          },
        },
      },
    ],
  },
};

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
