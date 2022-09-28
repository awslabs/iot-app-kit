import ab2str from 'arraybuffer-to-string';

import { GetSceneObjectFunction } from '../interfaces';

export function createTwinMakerFetch(getSceneObjectFunction?: GetSceneObjectFunction) {
  return (input: RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
    if (typeof input === 'string' && input.startsWith('s3://')) {
      const promise = getSceneObjectFunction?.(input);
      if (promise) {
        return promise.then((arrayBuffer) => {
          const readableStream: ArrayBuffer | null = null;

          const response: Response = {
            headers: undefined as any, // no valid value for S3
            ok: true,
            redirected: false,
            status: 200,
            statusText: 'OK',
            type: 'aws' as any,
            url: input,
            body: readableStream,
            bodyUsed: false,

            arrayBuffer: () => Promise.resolve(arrayBuffer),
            text: () => (!arrayBuffer ? null : ab2str(arrayBuffer)),

            json: () => {
              const response = !arrayBuffer ? null : JSON.parse(ab2str(arrayBuffer));
              return Promise.resolve(response);
            },

            clone: () => {
              throw new TypeError('[Not Implemented] clone()');
            },

            blob: () => {
              throw new TypeError('[Not Implemented] blob()');
            },

            formData: () => {
              throw new TypeError('[Not Implemented] formData()');
            },
          };

          return response;
        });
      }
    }

    return fetch(input, init);
  };
}
