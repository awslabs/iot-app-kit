/*
### This file will be replaced by a new AWS SDK after the Sophon API are available
import type {
  InvokeAssistantRequest, 
  InvokeAssistantResponse,
} from '@aws-sdk/client-iotsitewise';
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
  conversationId: string; // (Required) Creates a new conversation if
  // the Id exists and is active. Otherwise,
  // continue a conversation.

  endConversation?: boolean; // (Optional) Whether to end the current
  // conversation.
  // Default to false, meaning continue the
  // current conversation. Each conversation
  // is automatically ended after 24 hours

  returnExecutionSteps?: boolean; // (Optional) Indicates whether API should
  // stream back intermediate execution steps
  // Default value is false

  message: {
    chatMessage?: ChatMessage[];
    siteWisePropertyHistoriesSummarization?: EventSummaryRequest[];
    alarmsSummarizationMessage?: EventSummaryRequest[];
  };
}

export interface InvokeAssistantResponse {
  step: {
    // The intermediate step of an assistant invocation

    stepId: string; // An identifier of execution step
    // that are total ordered within
    // a turn

    rationale: {
      // contains the reasoning of the agent given the user input
      text: string;
    };

    toolInvocation: {
      toolName: string;
      toolInputsJson: string;
    }; // contains information that will be
    // input to the action group or
    // knowledge base that is to be
    // invoked or queried.
    // tool indicates native tool or
    // knowledgebase.

    observation: {
      toolOutputsJson: string;
      response: string;
    }; // The Observation object contains the
    // result or output of an action group
    // or knowledge base, or the response
    // to the user
  };

  response: {
    message: {
      content: ChatMessage[];
    };

    citations?: [
      // The citation that supports the
      // content generated
      {
        references: [
          // References to the actual data
          // in user's S3 or other storage system
          // as well as the file segment (if
          // it is text-based reference)
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

  // Exceptions
  // Since the API natively supports streaming, the exception must be returned as
  // an API response.

  internalFailureException?: {
    // e.g. System crashed (5xx)
    message: string;
  };

  accessDeniedException?: {
    // e.g. Access Iot Resource Denied
    // in tools. It can happen when
    // the builder does not give full
    // access to an OTE.
    message: string;
  };

  limitExceededException?: {
    // e.g Too much messages
    message: string;
  };

  resourceNotFoundException?: {
    // e.g We might need this
    message: string;
  };
}
