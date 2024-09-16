import type {
  ResponseStream,
  IoTSiteWise,
  InvokeAssistantRequest,
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

  /**
   * onError is called when the streaming api returns an error or an exception in the response.
   */
  onError?: AssistantClientInvocationErrorHandler;
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
  invocationDetail: InvokeAssistantRequest
) => void;

export type AssistantClientInvocationResponse = {
  conversationId: UniqueId | undefined;
  body: ResponseStream;
};

export type AssistantClientInvocationResponseHandler = (
  response: AssistantClientInvocationResponse,
  invocationDetail: InvokeAssistantRequest
) => void;

export type AssistantClientInvocationError = {
  name?: string;
  message?: string;
};

export type AssistantClientInvocationErrorHandler = (
  error: AssistantClientInvocationError,
  invocationDetail: InvokeAssistantRequest
) => void;
