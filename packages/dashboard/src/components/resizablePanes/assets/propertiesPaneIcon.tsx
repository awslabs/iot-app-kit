import React from 'react';
import {
  SVGWrapper,
  type SVGWrapperAriaProps,
} from '~/components/svg/svgWrapper';

export const PropertiesPaneIcon = (props: SVGWrapperAriaProps) => {
  return (
    <SVGWrapper width='20' height='20' viewBox='0 0 20 20' {...props}>
      <path
        d='M1.07425 19.5H7.73292C7.89231 19.5001 8.0497 19.466 8.19354 19.4003C8.33649 19.3342 8.4626 19.2391 8.56302 19.1214C8.71984 18.938 8.80604 18.7086 8.80716 18.4717V12.124C8.80709 11.9858 8.77775 11.8491 8.7209 11.722C8.60978 11.4725 8.40043 11.2749 8.1382 11.172C8.00937 11.1226 7.8717 11.0977 7.73292 11.0988H1.07425C0.938621 11.0992 0.804345 11.1246 0.678733 11.1736C0.55111 11.221 0.434435 11.292 0.335301 11.3824C0.230214 11.4785 0.146602 11.594 0.0895272 11.722C0.0303872 11.8485 -0.000121628 11.9855 7.04755e-06 12.124V18.4717C0.000249877 18.5952 0.0239653 18.7177 0.0699955 18.8331C0.115629 18.9471 0.18173 19.0526 0.265312 19.1448L0.307631 19.1868C0.401822 19.277 0.512058 19.3503 0.633159 19.4034C0.772776 19.4641 0.924176 19.4959 1.0775 19.4969L1.07425 19.5ZM9.65191 4.93498L13.9977 0.779557C14.1 0.681272 14.2233 0.605274 14.359 0.55675C14.4971 0.509489 14.6443 0.491416 14.7904 0.503775C15.0175 0.524216 15.23 0.620133 15.391 0.774882L19.7123 4.91161C19.8057 5.00045 19.8793 5.10645 19.9288 5.22323C20.0008 5.39575 20.0187 5.58463 19.9802 5.76673C19.9418 5.94882 19.8487 6.11623 19.7123 6.24845L15.3731 10.4101C15.2842 10.4944 15.1792 10.5616 15.0638 10.608C14.9488 10.6565 14.8249 10.6829 14.6992 10.6859C14.5651 10.6891 14.4317 10.6663 14.307 10.6189C14.1813 10.5731 14.0675 10.5019 13.9733 10.4101L9.65191 6.26871C9.4835 6.10678 9.38178 5.89212 9.36544 5.66417V5.61431C9.36444 5.4885 9.38937 5.36375 9.43881 5.24718C9.48824 5.13061 9.56121 5.02452 9.65354 4.93498H9.65191ZM1.07425 9.79622H7.73292C7.89201 9.7963 8.04911 9.76234 8.19273 9.69683C8.33635 9.63133 8.46286 9.53593 8.56302 9.4176C8.64213 9.32485 8.70331 9.21932 8.74369 9.10599C8.78526 8.99553 8.80673 8.87906 8.80716 8.76165V2.42178C8.80687 2.2836 8.77753 2.14689 8.7209 2.0198C8.61013 1.76965 8.40074 1.57145 8.1382 1.46823C8.01151 1.4191 7.87613 1.39371 7.73943 1.39344H1.07425C0.938621 1.39387 0.804345 1.41926 0.678733 1.46823C0.55111 1.51569 0.434435 1.58662 0.335301 1.67702C0.230214 1.77315 0.146602 1.88871 0.0895272 2.01668C0.0299836 2.1441 -0.000533118 2.2822 7.04755e-06 2.42178V8.76944C0.000229431 8.89249 0.0239488 9.01447 0.0699955 9.12936C0.11526 9.24351 0.181398 9.34903 0.265312 9.44098L0.307631 9.48304C0.401822 9.57319 0.512058 9.64653 0.633159 9.69962C0.772776 9.76029 0.924176 9.79215 1.0775 9.7931L1.07425 9.79622ZM7.73455 8.77256H1.07425V2.41711C1.64555 2.41711 7.73618 2.41711 7.74757 2.41711C7.74757 2.95309 7.74757 8.76632 7.74757 8.76944L7.73455 8.77256ZM11.3528 19.5H18.0115C18.1709 19.5001 18.3282 19.466 18.4721 19.4003C18.615 19.3342 18.7411 19.2391 18.8416 19.1214C18.9984 18.938 19.0846 18.7086 19.0857 18.4717V12.124C19.0854 11.9863 19.0561 11.8501 18.9994 11.7236C18.8871 11.4722 18.6752 11.2739 18.4102 11.172C18.2835 11.1229 18.1482 11.0975 18.0115 11.0972H11.3528C11.0781 11.1 10.8145 11.2012 10.6138 11.3808C10.5086 11.4774 10.425 11.5935 10.3681 11.722C10.3087 11.8489 10.2782 11.9865 10.2786 12.1256V18.4732C10.2788 18.5968 10.3025 18.7193 10.3485 18.8347C10.3942 18.9487 10.4603 19.0541 10.5439 19.1463L10.5862 19.1884C10.6804 19.2785 10.7906 19.3519 10.9117 19.405C11.0513 19.4656 11.2027 19.4975 11.356 19.4984L11.3528 19.5ZM18.0131 18.4763H11.3528V12.124C11.9241 12.124 18.0147 12.124 18.0261 12.124C18.0261 12.66 18.0261 18.4732 18.0261 18.4763H18.0131ZM7.73455 18.4763H1.07425V12.1209C1.64555 12.1209 7.73618 12.1209 7.74757 12.1209C7.74757 12.6569 7.74757 18.4701 7.74757 18.4732L7.73455 18.4763Z'
        fill='currentColor'
      />
    </SVGWrapper>
  );
};
