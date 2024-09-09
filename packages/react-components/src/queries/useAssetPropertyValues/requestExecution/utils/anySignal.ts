// https://github.com/jacobheun/any-signal

export interface ClearableSignal extends AbortSignal {
  clear: () => void;
}

/**
 * Takes an array of AbortSignals and returns a single signal.
 * If any signals are aborted, the returned signal will be aborted.
 */
export function anySignal(
  signals: Array<AbortSignal | undefined | null>
): ClearableSignal {
  const controller = new globalThis.AbortController();

  function onAbort(): void {
    controller.abort();

    for (const signal of signals) {
      if (signal?.removeEventListener != null) {
        signal.removeEventListener('abort', onAbort);
      }
    }
  }

  for (const signal of signals) {
    if (signal?.aborted === true) {
      onAbort();
      break;
    }

    if (signal?.addEventListener != null) {
      signal.addEventListener('abort', onAbort);
    }
  }

  function clear(): void {
    for (const signal of signals) {
      if (signal?.removeEventListener != null) {
        signal.removeEventListener('abort', onAbort);
      }
    }
  }

  function throwIfAborted(): void {
    for (const signal of signals) {
      if (signal?.aborted === true) {
        throw signal.reason;
      }
    }
  }

  const signal = controller.signal as ClearableSignal;
  signal.clear = clear;
  signal.throwIfAborted = signal.throwIfAborted ?? throwIfAborted;

  return signal;
}
