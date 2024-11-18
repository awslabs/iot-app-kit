import { fontSizeHeadingL } from '@cloudscape-design/design-tokens';

export const ExpandableSectionHeading = ({
  headerText,
}: {
  headerText: string;
}) => <h3 style={{ margin: 0, fontSize: fontSizeHeadingL }}>{headerText}</h3>;
