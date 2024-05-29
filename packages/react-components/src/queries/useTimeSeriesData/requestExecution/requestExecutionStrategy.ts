import { SendOptions } from './types';

export type OnRequestSuccessCallback<Request, Data> = (
  request: Request,
  data: Data[]
) => void;

export interface ExecuteRequestStrategy<Request, Data> {
  send(
    { request, signal }: SendOptions<Request>,
    onRequestSuccess: OnRequestSuccessCallback<Request, Data>
  ): Promise<Data[]>;
}

export class NoopExecuteRequestStrategy<Request, Data>
  implements ExecuteRequestStrategy<Request, Data>
{
  async send(options: SendOptions<Request>): Promise<Data[]> {
    console.warn(
      'No request strategy implemented. Could not handle: ',
      options.request
    );
    return [];
  }
}
