import React, { useRef, forwardRef } from 'react';
import mergeRefs from 'react-merge-refs';

import './CameraPreviewTrack.scss';

export interface CameraPreviewTrackProps {
  title?: string;
}

const CameraPreviewTrack = forwardRef<HTMLDivElement, CameraPreviewTrackProps>(({ title }, forwardedRef) => {
  const divRef = useRef<HTMLDivElement>();
  return (
    <div className={'tm-display-container'}>
      <div className={'tm-display-title'}>{title}</div>
      <div className={'tm-display-area'} ref={mergeRefs([divRef, forwardedRef])} />
    </div>
  );
});
CameraPreviewTrack.displayName = 'CameraPreviewTrack';

export default CameraPreviewTrack;
