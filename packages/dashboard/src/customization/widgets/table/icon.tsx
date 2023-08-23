import React from 'react';

const TableIcon: React.FC = () => (
  <span>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="38" height="38" rx="7" stroke="#414D5C" stroke-width="2"/>
      <path d="M12.5 20V15.7143H18.75V20H12.5ZM12.5 22.8571H18.75V27.1429H12.5V22.8571ZM21.25 27.1429V22.8571H27.5V27.1429H21.25ZM27.5 20H21.25V15.7143H27.5V20ZM12.5 10C11.1211 10 10 11.2813 10 12.8571V27.1429C10 28.7188 11.1211 30 12.5 30H27.5C28.8789 30 30 28.7188 30 27.1429V12.8571C30 11.2813 28.8789 10 27.5 10H12.5Z" fill="#414D5C"/>
    </svg>
    {/* Filled Icon for hover state */}
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="38" height="38" rx="7" fill="#414D5C" stroke="#414D5C" stroke-width="2"/>
      <path d="M12.5 20V15.7143H18.75V20H12.5ZM12.5 22.8571H18.75V27.1429H12.5V22.8571ZM21.25 27.1429V22.8571H27.5V27.1429H21.25ZM27.5 20H21.25V15.7143H27.5V20ZM12.5 10C11.1211 10 10 11.2813 10 12.8571V27.1429C10 28.7188 11.1211 30 12.5 30H27.5C28.8789 30 30 28.7188 30 27.1429V12.8571C30 11.2813 28.8789 10 27.5 10H12.5Z" fill="#FBFBFB"/>
    </svg>
  </span>
);

export default TableIcon;
