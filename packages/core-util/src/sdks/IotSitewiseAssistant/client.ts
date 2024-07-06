import type {
  AssistantClientInstanceParams,
  AssistantClientInvocationCompleteHandler,
  AssistantClientInvocationDetail,
  AssistantClientInvocationResponseHandler,
  AssistantClientRequestFns,
} from './types';

export class IoTSitewiseAssistantClient {
  private requestFns: AssistantClientRequestFns;
  private assistantName: string;
  private hasTrace = true;
  private defaultContext?: string;
  public onResponse?: AssistantClientInvocationResponseHandler;
  public onComplete?: AssistantClientInvocationCompleteHandler;

  constructor({
    requestFns,
    assistantName,
    defaultContext,
    onResponse,
    onComplete,
  }: AssistantClientInstanceParams) {
    this.requestFns = requestFns;
    this.assistantName = assistantName;
    this.defaultContext = defaultContext;
    this.onResponse = onResponse;
    this.onComplete = onComplete;
  }

  setAssistantName(assistantName: string): void {
    this.assistantName = assistantName;
  }

  setRequestFns(newRequestFns: AssistantClientRequestFns): void {
    this.requestFns = newRequestFns;
  }

  enableTrace(hasTrace: boolean): void {
    this.hasTrace = hasTrace;
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
    const assistantContext = `${this.defaultContext ?? ''} ${
      context ?? ''
    }`.trim();

    invokeAssistant({
      requestFns: this.requestFns,
      payload: {
        assistantName: this.assistantName,
        conversationId,
        invocationInputs: {
          messages: [{ text: utterance }],
          metadata: {
            context: assistantContext,
          },
        },
        enabledTrace: this.hasTrace,
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
    please generate a summary of these sitewise properties provided."`;

    return this.invoke(
      conversationId,
      summaryUtterance ?? defaultSummaryUtterance,
      context
    );
  }
}

async function invokeAssistant({
  requestFns,
  payload,
  onComplete,
  onResponse,
}: {
  requestFns: AssistantClientRequestFns;
  payload: AssistantClientInvocationDetail;
  onComplete?: AssistantClientInvocationCompleteHandler;
  onResponse?: AssistantClientInvocationResponseHandler;
}) {
  const response = await requestFns.invokeAssistant(payload);

  /**
   * Given the nature of streaming API, The client receives a chunk of the whole streamed response.
   */
  for await (const chunk of response.StreamResponse) {
    if (onResponse && chunk.trace?.traceId) {
      onResponse(
        {
          conversationId: payload.conversationId,
          body: chunk,
          statusCode: response.StatusCode,
        },
        payload
      );
    }

    if (onComplete && !chunk.trace) {
      onComplete(
        {
          conversationId: payload.conversationId,
          body: chunk,
          statusCode: response.StatusCode,
        },
        payload
      );
    }
  }
}
