import { colorBorderDividerDefault } from '@cloudscape-design/design-tokens';

export const VerticalSeparator = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '1px',
        borderBottom: `1px solid ${colorBorderDividerDefault}`,
      }}
    ></div>
  );
};
