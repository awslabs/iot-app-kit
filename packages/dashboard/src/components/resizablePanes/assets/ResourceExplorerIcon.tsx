import {
  SVGWrapper,
  type SVGWrapperAriaProps,
} from '../../../components/svg/svgWrapper';

export const ResourceExplorerIcon = (props: SVGWrapperAriaProps) => {
  return (
    <SVGWrapper width='24' height='24' viewBox='0 0 24 24' {...props}>
      <>
        <circle cx='8.5499' cy='12.15' r='0.9' fill='currentColor' />
        <circle cx='8.5499' cy='6.15' r='0.9' fill='currentColor' />
        <circle cx='8.5499' cy='18.15' r='0.9' fill='currentColor' />
        <path
          d='M5.7002 4.5C5.7002 4.08579 6.03598 3.75 6.4502 3.75H17.4002C17.8144 3.75 18.1502 4.08579 18.1502 4.5V9.15H5.7002V4.5Z'
          stroke='currentColor'
          strokeWidth='1.5'
        />
        <rect
          x='5.7002'
          y='9.1499'
          width='12.45'
          height='6.15'
          stroke='currentColor'
          strokeWidth='1.5'
        />
        <path
          d='M5.7002 19.9499C5.7002 20.3642 6.03598 20.7 6.4502 20.7H17.4002C17.8144 20.7 18.1502 20.3642 18.1502 19.95V15.3H5.7002V19.9499Z'
          stroke='currentColor'
          strokeWidth='1.5'
        />
      </>
    </SVGWrapper>
  );
};
