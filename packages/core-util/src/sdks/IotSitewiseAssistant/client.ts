import type {
  AssistantClientInstanceParams,
  AssistantClientInvocationCompleteHandler,
  AssistantClientInvocationDetail,
  AssistantClientInvocationResponseHandler,
  AssistantClientRequestFns,
  AssistantClientSummarizationProperties,
} from './types';

export class IoTSitewiseAssistantClient {
  private requestFns: AssistantClientRequestFns;
  private assistantName: string;
  private defaultContext?: string;
  private onResponse: AssistantClientInvocationResponseHandler;
  private onComplete: AssistantClientInvocationCompleteHandler;

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
        context: assistantContext,
        conversationId,
        message: {
          chatMessage: [{ text: utterance }],
        },
      },
      onComplete: this.onComplete,
      onResponse: this.onResponse,
    });
  }

  setAssistantName(assistantName: string): void {
    this.assistantName = assistantName;
  }

  setRequestFns(newRequestFns: AssistantClientRequestFns): void {
    this.requestFns = newRequestFns;
  }

  /**
   * Mark a conversationId as ended.
   * @param conversationId
   */
  endConversation(conversationId: string) {
    invokeAssistant({
      requestFns: this.requestFns,
      payload: {
        assistantName: this.assistantName,
        context: this.defaultContext,
        conversationId,
        endConversation: true,
        message: {
          chatMessage: [{ text: '' }],
        },
      },
      onComplete: this.onComplete,
      onResponse: this.onResponse,
    });
  }

  /**
   * Invoke the generative AI assistant and request a summarization given sitewise properties and context
   * @param conversationId Unique indentifier for the conversation
   * @param sitewiseProperties A list of assetId and propertyIds to give as context to the assistant to improve generated summary
   * @param summaryUtterance (optional) The message to send to the generative AI assistant around what kind or format of the generated summary
   * @param summaryInstructions (optional) Additional context to help the assistant to generate the summary
   * @returns
   */
  generateSummary(
    conversationId: string,
    sitewiseProperties: AssistantClientSummarizationProperties,
    summaryUtterance?: string,
    summaryInstructions?: string
  ) {
    const defaultSummaryInstructions = `Given these Sitewise Asset and Properties as context: "${
      JSON.stringify(sitewiseProperties) ?? ''
    }"`;
    const summaryContext = summaryInstructions ?? defaultSummaryInstructions;

    return this.invoke(
      conversationId,
      summaryUtterance ??
        `Please generate a summary of these sitewise properties provided.`,
      summaryContext
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
