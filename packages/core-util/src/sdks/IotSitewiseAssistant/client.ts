import type {
  InvokeAssistantRequest,
  IoTSiteWise,
  ResponseStream,
} from '@amzn/iot-black-pearl-internal-v3';
import type {
  AssistantClientInstanceParams,
  AssistantClientInvocationCompleteHandler,
  AssistantClientInvocationResponseHandler,
  AssistantClientInvocationErrorHandler,
} from './types';

export class IoTSitewiseAssistantClient {
  private iotSiteWiseClient: Pick<IoTSiteWise, 'invokeAssistant'>;
  private defaultContext?: string;
  public onResponse?: AssistantClientInvocationResponseHandler;
  public onComplete?: AssistantClientInvocationCompleteHandler;
  public onError?: AssistantClientInvocationErrorHandler;

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
  invoke(conversationId: string, utterance: string, context?: string) {
    const assistantContext = `given this context: "${
      this.defaultContext?.trim() ?? ''
    } ${context?.trim() ?? ''}"`;

    invokeAssistant({
      iotSiteWiseClient: this.iotSiteWiseClient,
      payload: {
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
  generateSummary(
    conversationId: string,
    context: string,
    summaryUtterance?: string
  ) {
    const defaultSummaryUtterance = `Given these Sitewise Asset and Properties as context, 
    please generate a summary of these sitewise properties provided.`;

    return this.invoke(
      conversationId,
      summaryUtterance ?? defaultSummaryUtterance,
      context
    );
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
  payload: InvokeAssistantRequest;
  onComplete?: AssistantClientInvocationCompleteHandler;
  onResponse?: AssistantClientInvocationResponseHandler;
  onError?: AssistantClientInvocationErrorHandler;
}) {
  try {
    const response = await iotSiteWiseClient.invokeAssistant(payload);
    /**
     * Given the nature of streaming API, The client receives a chunk of the whole streamed response.
     */
    for await (const chunk of response.body || []) {
      const exception = getExceptionFromResponse(chunk);
      if (onError && exception) {
        onError(exception, payload);
      }

      if (onResponse && chunk.trace?.text) {
        onResponse(
          {
            conversationId: payload.conversationId,
            body: chunk,
          },
          payload
        );
      }

      if (onComplete && chunk.output) {
        onComplete(
          {
            conversationId: payload.conversationId,
            body: chunk,
          },
          payload
        );
      }
    }
  } catch (error: any) {
    if (onError) {
      onError(error, payload);
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
