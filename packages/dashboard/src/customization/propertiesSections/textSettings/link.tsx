import type { InputProps } from '@cloudscape-design/components';
import {
  Box,
  Input,
  SpaceBetween,
  Toggle,
} from '@cloudscape-design/components';
import type { FC } from 'react';
import type { TextWidget } from '~/customization/widgets/types';

import * as awsui from '@cloudscape-design/design-tokens';

import { StyledExpandableSection } from '../components/styledComponents';
import './text.css';

type LinkSettingsProps = Pick<TextWidget['properties'], 'href' | 'isUrl'> & {
  updateHref: (newValue: string | undefined) => void;
  toggleIsUrl: (newValue: boolean | undefined) => void;
};

const defaultMessages = {
  title: 'Link',
  toggle: 'Create link',
  url: 'URL',
};

const LinkSettings: FC<LinkSettingsProps> = ({
  href = '',
  updateHref,
  isUrl = false,
  toggleIsUrl,
}) => {
  const header = (
    <div
      className='expandable-section-header'
      data-testid='text-widget-link-header'
    >
      <SpaceBetween size='m' direction='horizontal'>
        <span>{defaultMessages.title}</span>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
              toggleIsUrl(!isUrl);
            }
          }}
        >
          <Toggle
            checked={isUrl}
            onChange={({ detail }) => {
              toggleIsUrl(detail.checked);
            }}
            data-test-id='text-widget-create-link-toggle'
          >
            {defaultMessages.toggle}
          </Toggle>
        </div>
      </SpaceBetween>
    </div>
  );

  const onLinkTextChange: NonNullable<InputProps['onChange']> = ({
    detail: { value },
  }) => {
    updateHref(value);
  };

  return (
    <StyledExpandableSection
      className='accordian-header'
      headerText={header}
      headerAriaLabel='Text widget link settings'
      data-test-id='text-widget-link-section'
      defaultExpanded={isUrl}
      variant='footer'
    >
      <Box>
        <div className='link-configuration' style={{ gap: awsui.spaceScaledS }}>
          <label className='section-item-label'>{defaultMessages.url}</label>
          <div className='link-input'>
            <Input
              ariaLabel='text widget link input'
              value={href}
              onChange={onLinkTextChange}
              data-test-id='text-widget-link-input'
            />
          </div>
        </div>
      </Box>
    </StyledExpandableSection>
  );
};

export default LinkSettings;
