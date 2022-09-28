import EditorStateHelpers from '../../../src/store/helpers/editorStateHelpers';
import { ErrorCode, ErrorLevel } from '../../../src';
import { DisplayMessageCategory } from '../../../src/store/internalInterfaces';

describe('editorStateHelpers', () => {
  it('converts ErrorLevel Error ErrorDetails to appropriate DisplayMessages', () => {
    const errorDetails = {
      level: ErrorLevel.ERROR,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: 'This is an error',
      context: { test: 'test' },
    };

    const errorDisplayMessage = EditorStateHelpers.convertErrorToDisplayMessage(errorDetails);

    expect(errorDisplayMessage.messageText).toEqual(errorDetails.message);
    expect(errorDisplayMessage.category).toEqual(DisplayMessageCategory.Error);
    expect(errorDisplayMessage.params).toEqual(errorDetails.context);
  });

  it('converts ErrorLevel Warning ErrorDetails to appropriate DisplayMessages', () => {
    const errorDetails = {
      level: ErrorLevel.WARNING,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: 'This is a warning',
      context: { test: 'test' },
    };

    const errorDisplayMessage = EditorStateHelpers.convertErrorToDisplayMessage(errorDetails);

    expect(errorDisplayMessage.messageText).toEqual(errorDetails.message);
    expect(errorDisplayMessage.category).toEqual(DisplayMessageCategory.Warning);
    expect(errorDisplayMessage.params).toEqual(errorDetails.context);
  });

  it('converts ErrorLevel Fatal ErrorDetails to appropriate DisplayMessages', () => {
    const errorDetails = {
      level: ErrorLevel.FATAL,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: 'This is a fatal error',
      context: { test: 'test' },
    };

    const errorDisplayMessage = EditorStateHelpers.convertErrorToDisplayMessage(errorDetails);

    expect(errorDisplayMessage.messageText).toEqual(errorDetails.message);
    expect(errorDisplayMessage.category).toEqual(DisplayMessageCategory.Error);
    expect(errorDisplayMessage.params).toEqual(errorDetails.context);
  });

  it('converts ErrorLevel Unknown ErrorDetails to appropriate DisplayMessages', () => {
    const errorDetails = {
      level: 'Unknown' as any,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: 'This is an error by default',
      context: { test: 'test' },
    };

    const errorDisplayMessage = EditorStateHelpers.convertErrorToDisplayMessage(errorDetails);

    expect(errorDisplayMessage.messageText).toEqual(errorDetails.message);
    expect(errorDisplayMessage.category).toEqual(DisplayMessageCategory.Error);
    expect(errorDisplayMessage.params).toEqual(errorDetails.context);
  });
});
