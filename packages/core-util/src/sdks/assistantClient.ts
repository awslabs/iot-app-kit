import { RequestFunction } from '@iot-app-kit/core';
import type { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import {
  InvokeAssistantRequest,
  InvokeAssistantResponse,
  ChatMessage,
  EventSummaryRequest,
} from './assistantTypes';
import { InvokeAssistantCommand } from './assistantClientMockResponse';

type UniqueId = string;
type InvokeAssistantRequestFunction = RequestFunction<
  InvokeAssistantRequest,
  InvokeAssistantResponse
>;

export namespace AssistantClient {
  export type Options<T> = Partial<{
    defaultContext: string;

    // onResponse is called for each chunk returned from the streaming api response.
    onResponse: AssistantClient.InvocationResponseHandler<T>;

    // onComplete is called when all chunk have returned from the streaming api response.
    onComplete: AssistantClient.InvocationCompleteHandler;
  }>;

  export type RequestFns = {
    /**
     * Specify an implementation for `invokeAssistant`.
     */
    invokeAssistant?: InvokeAssistantRequestFunction;
  };

  export type ClientInstance<T> = {
    invoke: (
      utterance: string,
      options: { context?: string; conversationId?: UniqueId }
    ) => string;
    setRequestFns(requestFns: RequestFns);
  };

  export type InvocationCompleteHandler = () => void;

  export type InvocationResponseHandler<T> = (
    response: InvocationResponse,
    invocationDetail: InvocationDetail
  ) => void;

  export type InvocationResponse = {
    conversationId: UniqueId;
    body: InvokeAssistantResponse;
    statusCode?: number;
  };

  export type InvocationDetail = {
    context?: string;
    conversationId: UniqueId;
    message: {
      chatMessage?: ChatMessage[];
      siteWisePropertyHistoriesSummarization?: EventSummaryRequest[];
      alarmsSummarizationMessage?: EventSummaryRequest[];
    };
    endConversation?: boolean;
    returnExecutionSteps?: boolean;
  };
}

export const createAssistantClient = <T>(
  requestFns: AssistantClient.RequestFns,
  options: AssistantClient.Options<T>
) => {
  const { defaultContext, onComplete, onResponse } = options;
  //  let credentials = awsCredentials;

  return {
    /**
     * Invoke the generative AI assistant.
     * @param utterance The message to send to the generative AI assistant
     * @param options Options for augmenting the default context and specifying the conversastion id to be used for the invocation
     * @returns A new, unique `ConversationId` or the same id passed through options
     */
    invoke(
      utterance: string,
      options: { context?: string; conversationId?: UniqueId } = {}
    ) {
      const conversationId = options.conversationId ?? crypto.randomUUID();
      const context = `${defaultContext ?? ''} ${options.context ?? ''}`.trim();

      invokeAssistant({
        client: requestFns as IoTSiteWiseClient,
        payload: {
          context,
          conversationId,
          message: {
            chatMessage: [{ text: utterance }],
          },
        },
        onComplete,
        onResponse,
      });

      return conversationId;
    },

    setRequestFns(newRequestFns: AssistantClient.RequestFns) {
      requestFns = newRequestFns;
    },
  };
};

async function invokeAssistant<T>({
  client,
  payload,
  onComplete,
  onResponse,
}: {
  client: IoTSiteWiseClient;
  payload: AssistantClient.InvocationDetail;
  onComplete?: AssistantClient.InvocationCompleteHandler;
  onResponse?: AssistantClient.InvocationResponseHandler<T>;
}) {
  const command = new InvokeAssistantCommand(payload);

  // Correct implementation
  // const { body } = await client.send(command);
  // Temporary
  const responses = await command.send();

  // Each `event` is a chunk of the streamed response.
  for await (const response of responses.StreamReponse) {
    if (onResponse && response.step.stepId !== 'end') {
      onResponse(
        {
          conversationId: payload.conversationId,
          body: response,
          statusCode: responses.StatusCode,
        },
        payload
      );
    }

    if (onComplete && response.step.stepId === 'end') {
      onComplete();
    }
  }
}
