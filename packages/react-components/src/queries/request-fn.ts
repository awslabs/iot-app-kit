export type RequestTimeout = number;

/** First-class function used to send requests to AWS. */
export type RequestFunction<Request, Response> = (
  request: Request,
  options?: {
    abortSignal?: AbortSignal;
    requestTimeout?: RequestTimeout;
  }
) => PromiseLike<Response>;

/** Utility type to ensure the correct structure of `requestFns`. */
export type RequestFunctions<T> = T extends Partial<
  Record<
    infer RequestFunctionName,
    RequestFunction<infer Request, infer Response>
  >
>
  ? Partial<Record<RequestFunctionName, RequestFunction<Request, Response>>>
  : never;

/** Utility type for extracting request function parameters. */
export type RequestParameters<F> = F extends RequestFunction<
  infer Params,
  infer _Response
>
  ? Params
  : never;

/** Utility type for extracting request function response. */
export type RequestResponse<F> = F extends RequestFunction<
  infer _Params,
  infer Response
>
  ? Response
  : never;

/** Utility type for extracting request function parameters by key. */
export type PickRequestParameters<
  F,
  Key extends keyof RequestParameters<F>
> = Pick<RequestParameters<F>, Key>;
