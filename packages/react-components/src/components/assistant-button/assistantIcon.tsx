import { SVGWrapper, type SVGWrapperAriaProps } from './svgWrapper';

export const AssistantIcon = (props: SVGWrapperAriaProps) => {
  return (
    <SVGWrapper width='16' height='16' viewBox='0 0 16 16' {...props}>
      <>
        <g clipPath='url(#clip0_3945_24425)'>
          <path
            d='M8 1L9.9799 6.0201L15 8L9.9799 9.9799L8 15L6.0201 9.9799L1 8L6.0201 6.0201L8 1Z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinejoin='round'
          />
          <path
            d='M2.5 0L3.2955 1.7045L5 2.5L3.2955 3.2955L2.5 5L1.7045 3.2955L0 2.5L1.7045 1.7045L2.5 0Z'
            fill='currentColor'
          />
        </g>
        <defs>
          <clipPath id='clip0_3945_24425'>
            <rect width='16' height='16' fill='currentColor' />
          </clipPath>
        </defs>
      </>
    </SVGWrapper>
  );
};
