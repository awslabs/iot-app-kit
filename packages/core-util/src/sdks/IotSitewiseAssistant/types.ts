import {
  FinalResponse,
  InvokeAssistantStep,
  IoTSiteWise,
} from '@amzn/iot-black-pearl-internal-v3';
export type UniqueId = string;

export type AssistantClientInstanceParams = {
  iotSiteWiseClient: Pick<IoTSiteWise, 'invokeAssistant'>;
  defaultContext?: string;

  /**
   * onResponse is called for each chunk returned from the streaming api response.
   */
  onResponse?: AssistantClientInvocationResponseHandler;

  /**
   * onComplete is called when all chunk have returned from the streaming api response.
   */
  onComplete?: AssistantClientInvocationCompleteHandler;
};

export type ResponseStreamChunk = {
  step?: InvokeAssistantStep;
  finalResponse?: FinalResponse;
};
export type AssistantClientInstance = {
  invoke: (
    utterance: string,
    options: { context?: string; conversationId?: UniqueId }
  ) => string;
  setIotSiteWiseClient(iotSiteWiseClient: IoTSiteWise): void;
};

export type AssistantClientInvocationCompleteHandler = (
  response: AssistantClientInvocationResponse,
  invocationDetail: AssistantClientInvocationDetail
) => void;

export type AssistantClientInvocationResponse = {
  conversationId: UniqueId;
  body: ResponseStreamChunk;
};

export type AssistantClientInvocationResponseHandler = (
  response: AssistantClientInvocationResponse,
  invocationDetail: AssistantClientInvocationDetail
) => void;

export type AssistantClientInvocationDetail = {
  conversationId: UniqueId;
  message: string;
};
