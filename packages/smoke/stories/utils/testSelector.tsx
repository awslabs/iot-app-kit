import React from 'react';

const Selector = 'test';
export const TestSelector = `#${Selector}`;
export const TestSelectorComponent = () => <div style={{ position: 'fixed', top: 0, left: 0 }} id={Selector}>{TestSelector}</div>;
