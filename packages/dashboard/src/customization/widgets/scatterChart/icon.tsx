import React from 'react';

const ScatterIcon: React.FC = () => (
  <span>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="38" height="38" rx="7" stroke="#414D5C" stroke-width="2"/>
      <path d="M10.25 10.1001V29.6001C10.25 29.6829 10.3172 29.7501 10.4 29.7501H29.9" stroke="#414D5C" stroke-width="2" stroke-linecap="square"/>
      <circle cx="14.1501" cy="15.1999" r="1.05" fill="#414D5C"/>
      <circle cx="28.25" cy="12.0498" r="0.75" fill="#414D5C"/>
      <circle cx="24.2" cy="16.8499" r="1.2" fill="#414D5C"/>
      <circle cx="14.4498" cy="23.4498" r="0.9" fill="#414D5C"/>
      <circle cx="21.8001" cy="12.6502" r="1.2" fill="#414D5C"/>
      <circle cx="26.1501" cy="22.2502" r="1.8" fill="#414D5C"/>
      <circle cx="21.2" cy="25.0999" r="1.2" fill="#414D5C"/>
      <circle cx="18.8001" cy="19.2498" r="1.2" fill="#414D5C"/>
    </svg>
    {/* Filled Icon for hover state */}
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="38" height="38" rx="7" fill="#414D5C" stroke="#414D5C" stroke-width="2"/>
      <path d="M10.25 10.1V29.6C10.25 29.6828 10.3172 29.75 10.4 29.75H29.9" stroke="#FBFBFB" stroke-width="2" stroke-linecap="square"/>
      <circle cx="14.1496" cy="15.2" r="1.05" fill="#FBFBFB"/>
      <circle cx="28.25" cy="12.05" r="0.75" fill="#FBFBFB"/>
      <circle cx="24.2" cy="16.85" r="1.2" fill="#FBFBFB"/>
      <circle cx="14.4498" cy="23.4499" r="0.9" fill="#FBFBFB"/>
      <circle cx="21.7996" cy="12.65" r="1.2" fill="#FBFBFB"/>
      <circle cx="26.1496" cy="22.2501" r="1.8" fill="#FBFBFB"/>
      <circle cx="21.2" cy="25.1" r="1.2" fill="#FBFBFB"/>
      <circle cx="18.7996" cy="19.25" r="1.2" fill="#FBFBFB"/>
    </svg>
  </span>
);

export default ScatterIcon;
