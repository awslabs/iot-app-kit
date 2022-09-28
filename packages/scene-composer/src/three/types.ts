export type ResponseContentType = string | ArrayBuffer;

export type OnProgressFunc = (event: ProgressEvent) => void;

export type OnErrorFunc = (event: ErrorEvent) => void;

export type OnFileLoaderLoadFunc = (response: ResponseContentType) => void;
