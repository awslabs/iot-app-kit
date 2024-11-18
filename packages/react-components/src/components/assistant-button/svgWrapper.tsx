import { type CSSProperties, type PropsWithChildren } from 'react';

export type SVGWrapperAriaProps = {
  role: string;
  ariaLabel: string;
  style?: CSSProperties;
};

type SVGWrapperProps = PropsWithChildren &
  SVGWrapperAriaProps & {
    width: string;
    height: string;
    viewBox: string;
  };

export const SVGWrapper = ({ ariaLabel, ...props }: SVGWrapperProps) => {
  return (
    <svg
      {...props}
      aria-labelledby={ariaLabel}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {props.children}
    </svg>
  );
};
