import type { RequestFunction } from '@iot-app-kit/core';

export type UniqueId = string;
export type InvokeAssistantRequestFunction = RequestFunction<
  InvokeAssistantRequest,
  StreamingInvokeAssistantResponse
>;

export type AssistantClientRequestFns = {
  /**
   * Specify an implementation for `invokeAssistant`.
   */
  invokeAssistant: InvokeAssistantRequestFunction;
};

export type AssistantClientInstanceParams = {
  requestFns: AssistantClientRequestFns;
  assistantName :string;
  defaultContext?: string;

  /**
   * onResponse is called for each chunk returned from the streaming api response.
   */
  onResponse: AssistantClientInvocationResponseHandler;

  /**
   * onComplete is called when all chunk have returned from the streaming api response.
   */
  onComplete: AssistantClientInvocationCompleteHandler;
};

export type AssistantClientInstance = {
  invoke: (
    utterance: string,
    options: { context?: string; conversationId?: UniqueId }
  ) => string;
  setRequestFns(requestFns: AssistantClientRequestFns):void;
};

export type AssistantClientInvocationCompleteHandler = () => void;

export type AssistantClientInvocationResponse = {
  conversationId: UniqueId;
  body: InvokeAssistantResponse;
  statusCode?: number;
};

export type AssistantClientInvocationResponseHandler = (
  response: AssistantClientInvocationResponse,
  invocationDetail: AssistantClientInvocationDetail
) => void;

export type AssistantClientInvocationDetail = {
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

export type AssistantClientSummarizationProperty = {
  assetId: string;
  propertyId: string;
};

export type AssistantClientSummarizationProperties =
  AssistantClientSummarizationProperty[];

/**
 * ### The below types will be removed when a new AWS SDK after the Sophon API are available
 * import type {
 *   InvokeAssistantRequest,
 *   InvokeAssistantResponse,
 * } from '@aws-sdk/client-iotsitewise';
 */

export interface ChatMessage {
  text: string;
  image?: string; // image url or image base64 encoded binary data
  video?: string; // video url or image base64 encoded binary data
  audio?: string; // audio url or image base64 encoded binary data
}

export interface EventSummaryRequest {
  assetId: string;
  propertyId: string;
  startTime: Date | undefined;
  endTime: Date | undefined;
}

export interface InvokeAssistantRequest {
  /**
   * (Required) Creates a new conversation if
   * the Id exists and is active. Otherwise,
   * continue a conversation.
   */
  conversationId: string;

  /**
   * (Optional) Whether to end the current conversation.
   * Default to false, meaning continue the
   * current conversation. Each conversation
   * is automatically ended after 24 hours
   */
  endConversation?: boolean;

  /**
   * (Optional) Indicates whether API should
   * stream back intermediate execution steps
   * Default value is false
   */
  returnExecutionSteps?: boolean;

  message: {
    chatMessage?: ChatMessage[];
    siteWisePropertyHistoriesSummarization?: EventSummaryRequest[];
    alarmsSummarizationMessage?: EventSummaryRequest[];
  };
}

export interface InvokeAssistantResponse {
  /**
   * The intermediate step of an assistant invocation
   */
  step: {
    /**
     * An identifier of execution step
     * that are total ordered within a turn
     */
    stepId: string;

    rationale: {
      /**
       * contains the reasoning of the agent given the user input
       */
      text: string;
    };

    /**
     * contains information that will be input to the action group or
     * knowledge base that is to be invoked or queried.
     * tool indicates native tool or knowledgebase.
     */
    toolInvocation: {
      toolName: string;
      toolInputsJson: string;
    };

    /**
     * The Observation object contains the result or output of an action group
     * or knowledge base, or the response to the user
     */
    observation: {
      toolOutputsJson: string;
      response: string;
    };
  };

  response: {
    message: {
      content: ChatMessage[];
    };

    /**
     * The citation that supports the content generated
     */
    citations?: [
      {
        /**
         * References to the actual data in user's S3 or other storage system
         * as well as the file segment (if it is text-based reference)
         */
        references: [
          //
          {
            content: {
              text: string;
            };
            location: {
              s3Location: {
                uri: string;
              };
              type: string;
            };
          }
        ];
      }
    ];
  };

  /**
   * Exceptions
   * Since the API natively supports streaming, the exception must be returned as
   * an API response.
   * e.g. System crashed (5xx)
   */
  internalFailureException?: {
    message: string;
  };

  /**
   * e.g. Access Iot Resource Denied in tools. It can happen when
   * the builder does not give full access to an OTE.
   */
  accessDeniedException?: {
    message: string;
  };

  /**
   * e.g Too much messages
   */
  limitExceededException?: {
    message: string;
  };

  /**
   * e.g We might need this
   */
  resourceNotFoundException?: {
    message: string;
  };
}

export interface StreamingInvokeAssistantResponse {
  StatusCode: number;
  StreamResponse: AsyncIterable<InvokeAssistantResponse>;
}