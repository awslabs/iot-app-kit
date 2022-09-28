import * as React from 'react';
import { SVGProps } from 'react';

const SvgUnchecked = (props: SVGProps<SVGSVGElement>) => (
  <svg width={16} height={12} fill='none' xmlns='http://www.w3.org/2000/svg' {...props} />
);

export default SvgUnchecked;
