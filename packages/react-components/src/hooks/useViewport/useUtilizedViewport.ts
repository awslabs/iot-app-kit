import { Viewport } from '@iot-app-kit/core';
import { useViewport } from './useViewport';
import { useCallback, useState } from 'react';
import { useCustomCompareEffect, useEffectOnce } from 'react-use';
import { isEqual } from 'lodash';

type UtilizedViewportType = 'passed-in' | 'injected' | 'default' | 'none';

const resolveVieport = ({
  passedInViewport,
  injectedViewport,
  defaultViewport,
}: {
  passedInViewport?: Viewport;
  injectedViewport?: Viewport;
  defaultViewport?: Viewport;
}): { viewport?: Viewport; type: UtilizedViewportType } => {
  let viewport = undefined;
  let type: UtilizedViewportType = 'none';
  if (passedInViewport != null) {
    viewport = passedInViewport;
    type = 'passed-in';
  } else if (injectedViewport != null) {
    viewport = injectedViewport;
    type = 'injected';
  } else if (defaultViewport != null) {
    viewport = defaultViewport;
    type = 'default';
  }

  return {
    viewport,
    type,
  };
};

type UseUtilizedViewportOptions = {
  passedInViewport?: Viewport;
  defaultViewport: Viewport;
};

export const useUtilizedViewport = ({
  passedInViewport,
  defaultViewport,
}: UseUtilizedViewportOptions) => {
  const { viewport: injectedViewport, setViewport: updateViewportGroup } =
    useViewport();

  const [viewport, setViewport] = useState(
    resolveVieport({ passedInViewport, injectedViewport, defaultViewport })
      .viewport
  );
  const [viewportType, setViewportType] = useState(
    resolveVieport({ passedInViewport, injectedViewport, defaultViewport }).type
  );

  /**
   * The viewportManager will emit an event with the default viewport (10m)
   * if the component is not actually in a time sync provider.
   * This is because the manager wants to ensure that anything subscribed
   * to it gets the value when it subscribes. If we set the value
   * here, we ensure this does not happen.
   */
  useEffectOnce(() => {
    const { viewport: initialViewport, type: initialType } = resolveVieport({
      passedInViewport,
      injectedViewport,
      defaultViewport,
    });
    if (initialViewport) {
      updateViewportGroup(initialViewport);
      setViewportType(initialType);
    }
  });

  const updateViewport = useCallback(
    (updatedViewport: Viewport, updatedBy?: string) => {
      setViewport(updatedViewport);
      updateViewportGroup(updatedViewport, updatedBy);
    },
    [setViewport, updateViewportGroup]
  );

  useCustomCompareEffect(
    () => {
      const { viewport: resolvedViewport, type: resolvedType } = resolveVieport(
        {
          passedInViewport,
          injectedViewport,
          defaultViewport,
        }
      );
      if (!isEqual(viewport, resolvedViewport)) {
        setViewport(resolvedViewport);
      }
      if (!isEqual(viewportType, resolvedType)) {
        setViewportType(resolvedType);
      }
    },
    [passedInViewport, injectedViewport, defaultViewport],
    isEqual
  );

  return {
    viewport,
    setViewport: updateViewport,
    viewportType,
  };
};
