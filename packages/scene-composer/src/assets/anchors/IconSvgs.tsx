import { colors } from '../../utils/styleUtils';

export const ErrorIconSvgString = `
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52' width='256' height='256'>
    <g fill='none' fillRule='evenodd' transform='translate(1 1)'>
      <ellipse cx='25' cy='25' rx='21' ry='21' stroke='${colors.errorRed}' stroke-width='2' />
      <circle cx='25' cy='25' r='16' fill='${colors.errorRed}' />
      <path
        d='M29.3,17.9l2.8,2.8L27.9,25l4.3,4.3l-2.8,2.8L25,27.8l-4.3,4.3l-2.8-2.8l4.3-4.3l-4.3-4.3l2.8-2.8l4.3,4.3 L29.3,17.9L29.3,17.9z'
        fill='${colors.symbolWhite}'
      />
    </g>
  </svg>
`;

export const InfoIconSvgString = `
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52' width='256' height='256'>
    <g fill='none' fillRule='evenodd' transform='translate(1 1)'>
      <ellipse cx='25' cy='25' rx='21' ry='21' stroke='${colors.infoBlue}' stroke-width='2' />
      <circle cx='25' cy='25' r='16' fill='${colors.infoBlue}' />
    </g>
  </svg>
`;

export const WarningIconSvgString = `
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52' width='256' height='256'>
    <g fill='none' fillRule='evenodd' transform='translate(1 1)'>
      <ellipse cx='25' cy='25' rx='21' ry='21' stroke='${colors.warnYellow}' stroke-width='2' />
      <circle cx='25' cy='25' r='16' fill='${colors.warnYellow}' />
      <path d='M22 31h8v6h-8zM22 15v12h8V15z' fill='${colors.symbolWhite}' />
    </g>
  </svg>
`;

export const VideoIconSvgString = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width='256' height='256'>
  <g fill='none' fillRule='evenodd' transform='translate(1 1)'>
    <ellipse cx='25' cy='25' rx='21' ry='21' stroke='${colors.infoBlue}' stroke-width='2' />
    <circle cx='25' cy='25' r='16' fill='${colors.infoBlue}' />
  </g>
  <rect
    fill='#fafcfc'
    x="18.596239"
    y="20.9664"
    width="11.58664"
    height="10.10672"
    rx="1.63696"
    id="rect64" />
  <path
    fill='#fafcfc'
    d="m 30.63528,24.57312 a 0.2652,0.2652 0 0 0 -0.11544,0.22984 v 2.4336 a 0.2652,0.2652 0 0 0 0.11544,0.22984 l 2.56256,1.49552 c 0.13104,0.07696 0.2808,-0.04576 0.2808,-0.22984 v -5.42464 c 0,-0.18408 -0.14976,-0.3068 -0.2808,-0.22984 z"
    id="path66"/>
  </svg>
`;

export const SelectedIconSvgString = `
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='256' height='256'>
    <g opacity='1' fill='none' fillRule='evenodd' transform='translate(1 1)'>
      <ellipse cx='31' cy='31' rx='28' ry='28' stroke='${colors.infoRingWhite}' stroke-width='7' />
    </g>
  </svg>
`;
