import React, { useEffect, useState, useRef } from 'react';
import { tintData } from 'react-image-tint/lib/utils.js';

import { getArrowImagePath } from '../../../../utils/sceneResourceUtils';

const ARROW_SIZE = 33;

const TintArrow: React.FC<{ color?: string }> = ({ color }) => {
  const imgRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(getArrowImagePath());

  useEffect(() => {
    if (imgRef.current) {
      tintData(imgRef.current, color ?? 'white', { cache: false }).then((src) => imgRef.current && setImgSrc(src));
    }
  }, [color]);

  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        width: ARROW_SIZE,
        height: ARROW_SIZE,
      }}
    >
      <img src={imgSrc} ref={imgRef} crossOrigin='anonymous' />
    </div>
  );
};

interface IPreviewArrowProps {
  foregroundColor?: string;
  backgroundColor?: string;
  backgroundOpacity: number;
}

export const PreviewArrow: React.FC<IPreviewArrowProps> = ({ foregroundColor, backgroundColor, backgroundOpacity }) => {
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: ARROW_SIZE,
        height: ARROW_SIZE,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: ARROW_SIZE,
          height: ARROW_SIZE,
          backgroundColor,
          opacity: backgroundOpacity,
        }}
      />

      <TintArrow color={foregroundColor} />
    </div>
  );
};
