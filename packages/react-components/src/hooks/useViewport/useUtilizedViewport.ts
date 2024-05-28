import { Viewport } from '@iot-app-kit/core';
import { useViewport } from './useViewport';
import { useCallback, useState } from 'react';
import { useCustomCompareEffect } from 'react-use';
import { isEqual } from 'lodash';

const resolveVieport = ({
  passedInViewport,
  injectedViewport,
  defaultViewport,
}: {
  passedInViewport?: Viewport;
  injectedViewport?: Viewport;
  defaultViewport?: Viewport;
}) => passedInViewport ?? injectedViewport ?? defaultViewport;

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
  );

  const updateViewport = useCallback(
    (updatedViewport: Viewport, updatedBy?: string) => {
      setViewport(updatedViewport);
      updateViewportGroup(updatedViewport, updatedBy);
    },
    [setViewport, updateViewportGroup]
  );

  useCustomCompareEffect(
    () => {
      const resolvedViewport = resolveVieport({
        passedInViewport,
        injectedViewport,
        defaultViewport,
      });
      if (!isEqual(viewport, resolvedViewport)) {
        setViewport(resolvedViewport);
      }
    },
    [passedInViewport, injectedViewport, defaultViewport],
    isEqual
  );

  return {
    viewport,
    setViewport: updateViewport,
  };
};
