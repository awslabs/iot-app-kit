import type {
  ResponseStream,
  IoTSiteWise,
  InvokeAssistantRequest,
} from '@amzn/iot-black-pearl-internal-v3';

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
    options: { context?: string; conversationId?: string }
  ) => string;
  setIotSiteWiseClient(iotSiteWiseClient: IoTSiteWise): void;
};

export interface AssistantInvocationRequest extends InvokeAssistantRequest {
  componentId: string;
}

export type AssistantClientInvocationCompleteHandler = (
  request: AssistantInvocationRequest,
  response: AssistantClientInvocationResponse
) => void;

export type AssistantClientInvocationResponse = {
  conversationId: string | undefined;
  body: ResponseStream;
};

export type AssistantClientInvocationResponseHandler = (
  request: AssistantInvocationRequest,
  response: AssistantClientInvocationResponse
) => void;

export type AssistantClientInvocationError = {
  name?: string;
  message?: string;
};

export type AssistantClientInvocationErrorHandler = (
  request: AssistantInvocationRequest,
  error: AssistantClientInvocationError
) => void;

export type InvokeAssistantOptions = {
  componentId: string;
  conversationId: string;
  utterance: string;
  context?: string;
};
