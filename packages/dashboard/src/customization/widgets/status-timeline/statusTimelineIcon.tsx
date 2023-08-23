import * as React from 'react';

const TextIcon: React.FC = () => {
  return (
    <span>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="38" height="38" rx="7" stroke="#414D5C" stroke-width="2"/>
        <path d="M12 14V27" stroke="#414D5C" stroke-width="1.5" stroke-linecap="square"/>
        <path d="M15 14L15 27" stroke="#414D5C" stroke-width="1.5" stroke-linecap="square"/>
        <path d="M21 13L21 27" stroke="#414D5C" stroke-width="1.5" stroke-linecap="square"/>
        <path d="M23 13L23 27" stroke="#414D5C" stroke-width="1.5" stroke-linecap="square"/>
        <path d="M28 13L28 27" stroke="#414D5C" stroke-width="1.5" stroke-linecap="square"/>
        <path d="M29.6499 13L9.9999 13" stroke="#414D5C" stroke-width="2" stroke-linecap="square"/>
        <path d="M29.6499 27L9.9999 27" stroke="#414D5C" stroke-width="2" stroke-linecap="square"/>
      </svg>
      {/* Filled Icon for hover state */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="38" height="38" rx="7" fill="#414D5C" stroke="#414D5C" stroke-width="2"/>
        <path d="M12 14V27" stroke="#FBFBFB" stroke-width="1.5" stroke-linecap="square"/>
        <path d="M15 14L15 27" stroke="#FBFBFB" stroke-width="1.5" stroke-linecap="square"/>
        <path d="M21 13L21 27" stroke="#FBFBFB" stroke-width="1.5" stroke-linecap="square"/>
        <path d="M23 13L23 27" stroke="#FBFBFB" stroke-width="1.5" stroke-linecap="square"/>
        <path d="M28 13L28 27" stroke="#FBFBFB" stroke-width="1.5" stroke-linecap="square"/>
        <path d="M29.6504 13L10.0004 13" stroke="#FBFBFB" stroke-width="2" stroke-linecap="square"/>
        <path d="M29.6504 27L10.0004 27" stroke="#FBFBFB" stroke-width="2" stroke-linecap="square"/>
      </svg>
    </span>  
  );
};

export default TextIcon;
