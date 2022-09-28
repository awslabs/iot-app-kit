import React from 'react';
import { render } from '@testing-library/react';

import ILogger from '../../../../ILogger';
import ErrorBoundary from '..';

describe('<ErrorBoundary />', () => {
  it('should log unhandled errors in child rendering', () => {
    const loggerMock = {
      fatal: jest.fn(),
    } as unknown as ILogger;

    const error = new Error('unhandled');
    const errorInfo = {
      componentStack: 'This would be a stacktrace',
    };

    const onError = jest.fn();

    const sut = new ErrorBoundary({ onError });

    sut.context = {
      log: loggerMock,
      setLog: jest.fn(),
    };

    // Act
    sut.componentDidCatch(error, errorInfo);

    // Assert
    expect(loggerMock.fatal).toBeCalledWith(error.message, error, errorInfo.componentStack);
    expect(onError).toBeCalled();
  });

  it('should render error view if there is an issue', () => {
    const ErrorView = () => <div>Error View</div>;
    const BadKid = () => {
      throw new Error('unhandled');
    };

    const { container } = render(
      <ErrorBoundary ErrorView={ErrorView}>
        <BadKid />
      </ErrorBoundary>,
    );

    expect(container.outerHTML).toMatchSnapshot();
  });

  it('should render children view if there is not an issue', () => {
    const ErrorView = () => <div>Error View</div>;
    const GoodKid = () => <div>I get ice cream</div>;

    const { container } = render(
      <ErrorBoundary ErrorView={ErrorView}>
        <GoodKid />
      </ErrorBoundary>,
    );

    expect(container.outerHTML).toMatchSnapshot();
  });
});
