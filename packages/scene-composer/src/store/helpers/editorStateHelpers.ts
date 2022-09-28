import { IErrorDetails, ErrorLevel } from '../../common/errors';
import { DisplayMessageCategory, IDisplayMessage } from '../internalInterfaces';

function mapErrorLevelToCategory(level: ErrorLevel) {
  switch (level) {
    case ErrorLevel.ERROR:
    case ErrorLevel.FATAL:
      return DisplayMessageCategory.Error;
    case ErrorLevel.WARNING:
      return DisplayMessageCategory.Warning;
    default:
      return DisplayMessageCategory.Error;
  }
}

function convertErrorToDisplayMessage(error: IErrorDetails): IDisplayMessage {
  return {
    category: mapErrorLevelToCategory(error.level),
    messageText: error.message,
    params: error.context,
  };
}

export default {
  convertErrorToDisplayMessage,
};
