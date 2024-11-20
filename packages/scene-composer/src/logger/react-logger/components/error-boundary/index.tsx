import { Component, type ContextType, type ReactNode } from 'react';

import LoggingContext from '../../contexts/logging';

export interface ErrorBoundaryProps {
  ErrorView?: any;
  onError?(error: Error, errorInfo?: { componentStack: string }): void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static contextType = LoggingContext;
  context: ContextType<typeof LoggingContext> | undefined = undefined;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: !!error, error };
  }

  componentDidCatch(error: Error, errorInfo?: { componentStack: string }): void {
    const { onError } = this.props;

    /* istanbul ignore next */
    if (this.context) {
      const { log } = this.context;

      if (log && log.fatal) {
        log?.fatal(error.message, error, errorInfo?.componentStack);
      }
    }

    if (onError) {
      onError(error, errorInfo);
    }
  }

  render(): React.ReactNode {
    const { children, ErrorView } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      // By default, if something blows up within an eror boundary, we don't want to show anything to the user, but this behavior can be oveerriden.
      return ErrorView ? <ErrorView error={error} /> : /* istanbul ignore next */ null;
    }

    return children;
  }
}

export default ErrorBoundary;
