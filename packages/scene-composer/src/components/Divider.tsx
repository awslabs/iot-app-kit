import styled from 'styled-components';
import * as awsui from '@awsui/design-tokens';

export const Divider = styled.hr`
  height: 1px;
  border-width: 0px;
  background-color: ${awsui.colorBorderDividerDefault};
`;
