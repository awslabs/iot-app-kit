import {
  ChatMessage,
  EventSummaryRequest,
  AssistantClientInstanceParams,
  AssistantClientInvocationCompleteHandler,
  AssistantClientInvocationDetail,
  AssistantClientInvocationResponseHandler,
  AssistantClientRequestFns,
  UniqueId,
} from './assistantTypes';
import { v4 as uuidv4 } from 'uuid';


export const createAssistantClient = <T>({
  requestFns,
  defaultContext,
  onResponse,
  onComplete,
}: AssistantClientInstanceParams<T>) => {
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
      const conversationId = options.conversationId ?? uuidv4();
      const context = `${defaultContext ?? ''} ${options.context ?? ''}`.trim();

      invokeAssistant({
        requestFns,
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

    setRequestFns(newRequestFns: AssistantClientRequestFns) {
      requestFns = newRequestFns;
    },
  };
};

async function invokeAssistant<T>({
  requestFns,
  payload,
  onComplete,
  onResponse,
}: {
  requestFns: AssistantClientRequestFns;
  payload: AssistantClientInvocationDetail;
  onComplete?: AssistantClientInvocationCompleteHandler;
  onResponse?: AssistantClientInvocationResponseHandler<T>;
}) {
  const response = await requestFns.invokeAssistant(payload);

  // Each `event` is a chunk of the streamed response.
  for await (const chunk of response.StreamResponse) {
    if (onResponse && chunk.step.stepId !== 'end') {
      onResponse(
        {
          conversationId: payload.conversationId,
          body: chunk,
          statusCode: response.StatusCode,
        },
        payload
      );
    }

    if (onComplete && chunk.step.stepId === 'end') {
      onComplete();
    }
  }
}
