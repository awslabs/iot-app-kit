import IoTSiteWise, {
  FinalResponse,
  InvokeAssistantStep,
} from '@amzn/iot-sitewise-sdk/clients/iotsitewise';
import type {
  AssistantClientInstanceParams,
  AssistantClientInvocationCompleteHandler,
  AssistantClientInvocationDetail,
  AssistantClientInvocationResponseHandler,
} from './types';

export class IoTSitewiseAssistantClient {
  private iotSiteWiseClient: IoTSiteWise;
  // @ts-ignore: keeping as API will add assistantId to the request
  private assistantId: string;
  private defaultContext?: string;
  public onResponse?: AssistantClientInvocationResponseHandler;
  public onComplete?: AssistantClientInvocationCompleteHandler;

  constructor({
    iotSiteWiseClient,
    assistantId,
    defaultContext,
    onResponse,
    onComplete,
  }: AssistantClientInstanceParams) {
    this.iotSiteWiseClient = iotSiteWiseClient;
    this.assistantId = assistantId;
    this.defaultContext = defaultContext;
    this.onResponse = onResponse;
    this.onComplete = onComplete;
  }

  setAssistantId(assistantId: string): void {
    this.assistantId = assistantId;
  }

  setIotSiteWiseClient(newIotSiteWiseClient: IoTSiteWise): void {
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
  iotSiteWiseClient: IoTSiteWise;
  payload: AssistantClientInvocationDetail;
  onComplete?: AssistantClientInvocationCompleteHandler;
  onResponse?: AssistantClientInvocationResponseHandler;
}) {
  const response = await iotSiteWiseClient.invokeAssistant(payload).promise();

  /**
   * Given the nature of streaming API, The client receives a chunk of the whole streamed response.
   */
  for await (const chunk of response.body) {
    const responseChunk = chunk as {
      step?: InvokeAssistantStep;
      finalResponse?: FinalResponse;
    };
    if (onResponse && responseChunk.step?.stepId) {
      onResponse(
        {
          conversationId: payload.conversationId,
          body: responseChunk,
        },
        payload
      );
    }

    if (onComplete && !responseChunk.step) {
      onComplete(
        {
          conversationId: payload.conversationId,
          body: responseChunk,
        },
        payload
      );
    }
  }
}
