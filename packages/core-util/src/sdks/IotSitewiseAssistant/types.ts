import type {
  InvokeAssistantRequest,
  IoTSiteWise,
  ResponseStream,
} from '@aws-sdk/client-iotsitewise';

export interface AssistantClientInstanceParams {
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
}

export interface AssistantClientInstance {
  invoke: (
    utterance: string,
    options: { context?: string; conversationId?: string }
  ) => string;

  setIotSiteWiseClient(iotSiteWiseClient: IoTSiteWise): void;
}

export interface AssistantInvocationRequest extends InvokeAssistantRequest {
  componentId: string;
}

export type AssistantClientInvocationCompleteHandler = (
  request: AssistantInvocationRequest,
  response: AssistantClientInvocationResponse
) => void;

export interface AssistantClientInvocationResponse {
  conversationId: string | undefined;
  body: ResponseStream;
}

export type AssistantClientInvocationResponseHandler = (
  request: AssistantInvocationRequest,
  response: AssistantClientInvocationResponse
) => void;

export interface AssistantClientInvocationError {
  name?: string;
  message?: string;
}

export type AssistantClientInvocationErrorHandler = (
  request: AssistantInvocationRequest,
  error: AssistantClientInvocationError
) => void;

export interface InvokeAssistantOptions {
  componentId: string;
  conversationId: string;
  utterance: string;
  context?: string;
}
