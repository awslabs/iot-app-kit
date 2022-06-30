// Copied from Synchro-charts "ScLoadingSpinner"
import React from 'react';

export const LoadingSpinner: React.FunctionComponent<{ size?: number; dark?: boolean } | Record<string, never>> = (
  props
) => {
  const { size, dark = false } = props;

  return (
    <svg
      className={dark ? 'dark' : undefined}
      style={size != null ? { width: `${size}px`, height: `${size}px` } : {}}
      data-testid="loading"
      viewBox="0 0 200 200"
    >
      <defs>
        <clipPath id="a">
          <path d="M200 100a100 100 0 11-2.19-20.79l-9.78 2.08A90 90 0 10190 100z" />
        </clipPath>
        <filter id="b" x="0" y="0">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
        <path id="c" d="M250 100a150 150 0 01-3.28 31.19L100 100z" />
      </defs>
      <g clipPath="url(#a)">
        <g filter="url(#b)" transform="rotate(-6 100 100)">
          <use xlinkHref="#c" fillOpacity="0" />
          <use xlinkHref="#c" fillOpacity=".03" transform="rotate(12 100 100)" />
          <use xlinkHref="#c" fillOpacity=".07" transform="rotate(24 100 100)" />
          <use xlinkHref="#c" fillOpacity=".1" transform="rotate(36 100 100)" />
          <use xlinkHref="#c" fillOpacity=".14" transform="rotate(48 100 100)" />
          <use xlinkHref="#c" fillOpacity=".17" transform="rotate(60 100 100)" />
          <use xlinkHref="#c" fillOpacity=".2" transform="rotate(72 100 100)" />
          <use xlinkHref="#c" fillOpacity=".24" transform="rotate(84 100 100)" />
          <use xlinkHref="#c" fillOpacity=".28" transform="rotate(96 100 100)" />
          <use xlinkHref="#c" fillOpacity=".31" transform="rotate(108 100 100)" />
          <use xlinkHref="#c" fillOpacity=".34" transform="rotate(120 100 100)" />
          <use xlinkHref="#c" fillOpacity=".38" transform="rotate(132 100 100)" />
          <use xlinkHref="#c" fillOpacity=".41" transform="rotate(144 100 100)" />
          <use xlinkHref="#c" fillOpacity=".45" transform="rotate(156 100 100)" />
          <use xlinkHref="#c" fillOpacity=".48" transform="rotate(168 100 100)" />
          <use xlinkHref="#c" fillOpacity=".52" transform="rotate(180 100 100)" />
          <use xlinkHref="#c" fillOpacity=".55" transform="rotate(192 100 100)" />
          <use xlinkHref="#c" fillOpacity=".59" transform="rotate(204 100 100)" />
          <use xlinkHref="#c" fillOpacity=".62" transform="rotate(216 100 100)" />
          <use xlinkHref="#c" fillOpacity=".66" transform="rotate(228 100 100)" />
          <use xlinkHref="#c" fillOpacity=".69" transform="rotate(240 100 100)" />
          <use xlinkHref="#c" fillOpacity=".7" transform="rotate(252 100 100)" />
          <use xlinkHref="#c" fillOpacity=".72" transform="rotate(264 100 100)" />
          <use xlinkHref="#c" fillOpacity=".76" transform="rotate(276 100 100)" />
          <use xlinkHref="#c" fillOpacity=".79" transform="rotate(288 100 100)" />
          <use xlinkHref="#c" fillOpacity=".83" transform="rotate(300 100 100)" />
          <use xlinkHref="#c" fillOpacity=".86" transform="rotate(312 100 100)" />
          <use xlinkHref="#c" fillOpacity=".93" transform="rotate(324 100 100)" />
          <use xlinkHref="#c" fillOpacity=".97" transform="rotate(336 100 100)" />
          <use xlinkHref="#c" transform="rotate(348 100 100)" />
        </g>
      </g>
    </svg>
  );
};
