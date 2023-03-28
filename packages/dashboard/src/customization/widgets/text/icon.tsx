import React from 'react';

const TextIcon: React.FC = () => {
  return (
    <svg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
      <text x='5' y='15'>
        T
      </text>
      <line x1='2.5' y1='20' x2='17.5' y2='20' stroke='inherit' strokeWidth='2'></line>
    </svg>
  );
};

export default TextIcon;
