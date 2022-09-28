import { CustomError } from 'ts-custom-error';

export enum ErrorCode {
  SC_ERROR_LOAD_SCENE = 'SC_ERROR_LOAD_SCENE',
}

export enum ErrorLevel {
  FATAL = 'FATAL', // unexpected non-recoverable errors, e.g. unknown exception
  ERROR = 'ERROR', // expected non-recoverable errors, e.g. unsupported major version
  WARNING = 'WARNING', // recoverable errors, e.g. unsupported minor version
}

export const ERROR_MESSAGE_DICT = {
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  INVALID_DOCUMENT: 'Invalid scene document.',
  SPECVERSION_MAJOR_VERSION_TOO_NEW: 'The format of the scene is newer than the supported format version.',
  SPECVERSION_MINOR_VERSION_TOO_NEW:
    'The scene may contain features not supported by the renderer. Please consider upgrading the renderer.',
  UNKNOWN_COMPONENT_TYPE: 'Unknown component type {{componentType}}.',
  UNKNOWN_MODEL_REF_MODEL_TYPE: 'Unknown model type {{modelType}}.',
  INVALID_RULE: 'Rule#[{ruleId}] is invalid.',
};

export interface IErrorDetails {
  level: ErrorLevel;
  code: ErrorCode;
  message: string;
  context?: Record<string, string>;
}

// TODO: Handle I18N error message
export class SceneComposerRuntimeError extends CustomError {
  public details: IErrorDetails;
  public innerError?: unknown;

  constructor(
    level: ErrorLevel,
    code: ErrorCode,
    message: string,
    context?: Record<string, string>,
    innerError?: unknown,
  ) {
    super(`[${level}][${code}] ${message}`);
    this.details = {
      level: level,
      code: code,
      message: message,
      context: context,
    };
    this.innerError = innerError;
  }
}
