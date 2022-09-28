import * as React from 'react';
import { SVGProps } from 'react';

const SvgFolder = (props: SVGProps<SVGSVGElement>) => (
  <svg width={14} height={14} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M12.25 13.125H1.75a.874.874 0 0 1-.875-.875V1.75c0-.484.391-.875.875-.875h4.5c.303 0 .585.157.744.415L8.362 3.5h3.888c.484 0 .875.391.875.875v7.875a.874.874 0 0 1-.875.875Zm-6.487-10.5H2.625v8.75h8.75V5.25h-3.5a.875.875 0 0 1-.745-.415l-1.367-2.21Z'
      fill='#879596'
    />
  </svg>
);

export default SvgFolder;
