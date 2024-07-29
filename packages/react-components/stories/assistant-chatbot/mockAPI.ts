import type {
  InvokeAssistantResponse,
  InvokeAssistantRequest,
} from '@amzn/iot-sitewise-sdk/clients/iotsitewise';
import { AWSError } from 'aws-sdk/lib/core';
import type { Request, PromiseResult } from 'aws-sdk/lib/request';
// import type { Response } from 'aws-sdk/lib/response';
import {
  mockedInvokeAssistantResponse1,
  mockedInvokeAssistantResponse2,
  mockedInvokeAssistantResponse4,
  mockedInvokeAssistantResponse5,
} from '../../src/__mocks__/assistantMockedResponse';

// TODO: without msw for now, but change to msw in the future
export const MockInvokeAssistant = (
  params: InvokeAssistantRequest,
  callback?: (err: AWSError, data: InvokeAssistantResponse) => void
): Request<InvokeAssistantResponse, AWSError> => {
  return {
    promise: () =>
      new Promise((resolve) => {
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

        if (callback) {
          callback('error' as unknown as AWSError, {
            body: [],
            conversationId: 'conversationId',
          });
        }

        resolve({
          conversationId: 'conversationId',
          body: asyncIterator,
        } as unknown as PromiseResult<InvokeAssistantResponse, AWSError>);
      }),
  } as Request<InvokeAssistantResponse, AWSError>;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
