import type { IoTSiteWise, ResponseStream } from '@aws-sdk/client-iotsitewise';
import type {
  AssistantClientInstanceParams,
  AssistantClientInvocationCompleteHandler,
  AssistantClientInvocationError,
  AssistantClientInvocationErrorHandler,
  AssistantClientInvocationResponseHandler,
  AssistantInvocationRequest,
  InvokeAssistantOptions,
} from './types';

export class IoTSiteWiseAssistantClient {
  public onResponse?: AssistantClientInvocationResponseHandler;
  public onComplete?: AssistantClientInvocationCompleteHandler;
  public onError?: AssistantClientInvocationErrorHandler;
  private iotSiteWiseClient: Pick<IoTSiteWise, 'invokeAssistant'>;
  private defaultContext?: string;

  constructor({
    iotSiteWiseClient,
    defaultContext,
    onResponse,
    onComplete,
    onError,
  }: AssistantClientInstanceParams) {
    this.iotSiteWiseClient = iotSiteWiseClient;
    this.defaultContext = defaultContext;
    this.onResponse = onResponse;
    this.onComplete = onComplete;
    this.onError = onError;
  }

  setIotSiteWiseClient(
    newIotSiteWiseClient: Pick<IoTSiteWise, 'invokeAssistant'>
  ): void {
    this.iotSiteWiseClient = newIotSiteWiseClient;
  }

  setRequestHandlers(
    newOnResponse: AssistantClientInvocationResponseHandler,
    newOnComplete: AssistantClientInvocationCompleteHandler,
    newOnError: AssistantClientInvocationErrorHandler
  ): void {
    this.onResponse = newOnResponse;
    this.onComplete = newOnComplete;
    this.onError = newOnError;
  }

  /**
   * Invoke the generative AI assistant.
   * @param conversationId Unique indentifier for the conversation
   * @param utterance The message to send to the generative AI assistant
   * @param context additional context for augmenting the default context
   */
  invoke({
    componentId,
    conversationId,
    utterance,
    context,
  }: InvokeAssistantOptions) {
    const mergedContext = `${this.defaultContext?.trim() ?? ''}${
      context?.trim() ?? ''
    }`;
    const isContextEmpty = !mergedContext || mergedContext === '{}';
    const assistantContext = !isContextEmpty
      ? `given this context: ${mergedContext}`
      : '';

    void invokeAssistant({
      iotSiteWiseClient: this.iotSiteWiseClient,
      payload: {
        componentId,
        conversationId,
        enableTrace: true,
        message: `${assistantContext} ${utterance}`,
      },
      onComplete: this.onComplete,
      onResponse: this.onResponse,
      onError: this.onError,
    });
  }

  /**
   * Invoke the generative AI assistant and request a summarization given sitewise properties and context
   * @param conversationId Unique indentifier for the conversation
   * @param context A JSON object with all assetIds and propertyIds to give as context to the assistant to improve generated summary
   * @param summaryUtterance (optional) The message to send to the generative AI assistant around what kind or format of the generated summary
   * @returns
   */
  generateSummary({
    componentId,
    conversationId,
    context,
    utterance,
  }: InvokeAssistantOptions) {
    const defaultSummaryUtterance = `Given these Sitewise Asset and Properties as context,
    please generate a summary of these sitewise properties provided.`;

    return this.invoke({
      componentId,
      conversationId,
      utterance: utterance ?? defaultSummaryUtterance,
      context,
    });
  }
}

async function invokeAssistant({
  iotSiteWiseClient,
  payload,
  onComplete,
  onResponse,
  onError,
}: {
  iotSiteWiseClient: Pick<IoTSiteWise, 'invokeAssistant'>;
  payload: AssistantInvocationRequest;
  onComplete?: AssistantClientInvocationCompleteHandler;
  onResponse?: AssistantClientInvocationResponseHandler;
  onError?: AssistantClientInvocationErrorHandler;
}) {
  try {
    const invokeAssistantParams = {
      conversationId: payload.conversationId,
      enableTrace: payload.enableTrace,
      message: payload.message,
    };
    const response = await iotSiteWiseClient.invokeAssistant(
      invokeAssistantParams
    );
    /**
     * Given the nature of streaming API, The client receives a chunk of the whole streamed response.
     */
    for await (const chunk of response.body || []) {
      const exception = getExceptionFromResponse(chunk);
      if (onError && exception) {
        onError(payload, exception);
      }

      if (onResponse && chunk.trace?.text) {
        onResponse(payload, {
          conversationId: payload.conversationId,
          body: chunk,
        });
      }

      if (onComplete && chunk.output) {
        onComplete(payload, {
          conversationId: payload.conversationId,
          body: chunk,
        });
      }
    }
  } catch (error: unknown) {
    if (onError) {
      onError(payload, error as AssistantClientInvocationError);
    }
  }
}

const getExceptionFromResponse = (response: ResponseStream) => {
  return (
    response.accessDeniedException ||
    response.internalFailureException ||
    response.limitExceededException ||
    response.resourceNotFoundException ||
    response.throttlingException ||
    undefined
  );
};
