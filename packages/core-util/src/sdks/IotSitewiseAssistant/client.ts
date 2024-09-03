import type {
  InvokeAssistantRequest,
  IoTSiteWise,
} from '@amzn/iot-black-pearl-internal-v3';
import type {
  AssistantClientInstanceParams,
  AssistantClientInvocationCompleteHandler,
  AssistantClientInvocationResponseHandler,
} from './types';

export class IoTSitewiseAssistantClient {
  private iotSiteWiseClient: Pick<IoTSiteWise, 'invokeAssistant'>;
  private defaultContext?: string;
  public onResponse?: AssistantClientInvocationResponseHandler;
  public onComplete?: AssistantClientInvocationCompleteHandler;

  constructor({
    iotSiteWiseClient,
    defaultContext,
    onResponse,
    onComplete,
  }: AssistantClientInstanceParams) {
    this.iotSiteWiseClient = iotSiteWiseClient;
    this.defaultContext = defaultContext;
    this.onResponse = onResponse;
    this.onComplete = onComplete;
  }

  setIotSiteWiseClient(
    newIotSiteWiseClient: Pick<IoTSiteWise, 'invokeAssistant'>
  ): void {
    this.iotSiteWiseClient = newIotSiteWiseClient;
  }

  setRequestHandlers(
    newOnResponse: AssistantClientInvocationResponseHandler,
    newOnComplete: AssistantClientInvocationCompleteHandler
  ): void {
    this.onResponse = newOnResponse;
    this.onComplete = newOnComplete;
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
}: {
  iotSiteWiseClient: Pick<IoTSiteWise, 'invokeAssistant'>;
  payload: InvokeAssistantRequest;
  onComplete?: AssistantClientInvocationCompleteHandler;
  onResponse?: AssistantClientInvocationResponseHandler;
}) {
  const response = await iotSiteWiseClient.invokeAssistant(payload);
  /**
   * Given the nature of streaming API, The client receives a chunk of the whole streamed response.
   */
  for await (const chunk of response.body || []) {
    if (onResponse && chunk.trace?.text) {
      onResponse(
        {
          conversationId: payload.conversationId,
          body: chunk,
        },
        payload
      );
    }

    if (onComplete && !chunk.trace) {
      onComplete(
        {
          conversationId: payload.conversationId,
          body: chunk,
        },
        payload
      );
    }
  }
}
