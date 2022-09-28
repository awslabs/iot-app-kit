import React from 'react';

export default (componentName) =>
  // eslint-disable-next-line react/prop-types
  ({ children, ...props }) => {
    const snapshotableProps = {};
    const renderProps = [];

    Object.entries(props).forEach(([key, value]) => {
      try {
        // Covers edge case where stringify fails due to circular object graphs
        if (typeof value === 'object') {
          if (React.isValidElement(value)) {
            renderProps[key] = value;
          } else {
            snapshotableProps[key] = JSON.stringify(value);
          }
        } else {
          snapshotableProps[key] = value;
        }
      } catch (e) {
        snapshotableProps[key] = value;
      }
    });

    return (
      <div data-mocked={componentName} {...snapshotableProps}>
        {Object.entries(renderProps).map(([key, value]) => (
          <div key={key}>{value}</div>
        ))}
        {children}
      </div>
    );
  };
