import React from 'react';
import { ExpandableSection, Input, Toggle } from '@cloudscape-design/components';
import { useWidgetLense } from '../../utils/useWidgetLense';
import './index.css';
import type { FC } from 'react';
import type { InputProps } from '@cloudscape-design/components';
import type { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import type { TextWidget } from '~/customization/widgets/types';

import * as awsui from '@cloudscape-design/design-tokens';

const defaultMessages = {
  title: 'Link',
  toggle: 'Create link',
  url: 'URL',
};

const LinkSettings: FC<TextWidget> = (widget) => {
  const [link = '', updateLink] = useWidgetLense<TextWidget, string | undefined>(
    widget,
    (w) => w.properties.href,
    (w, href) => ({
      ...w,
      properties: {
        ...w.properties,
        href,
      },
    })
  );

  const [isLink = false, toggleIsLink] = useWidgetLense<TextWidget, boolean | undefined>(
    widget,
    (w) => w.properties.isUrl,
    (w, isUrl) => ({
      ...w,
      properties: {
        ...w.properties,
        isUrl,
      },
    })
  );

  const header = (
    <div className='expandable-section-header'>
      <span>{defaultMessages.title}</span>
      <div onClick={(e) => e.stopPropagation()}>
        <Toggle
          checked={isLink}
          onChange={({ detail }) => {
            toggleIsLink(detail.checked);
          }}
          data-test-id='text-widget-create-link-toggle'
        >
          {defaultMessages.toggle}
        </Toggle>
      </div>
    </div>
  );

  const onLinkTextChange: NonCancelableEventHandler<InputProps.ChangeDetail> = ({ detail: { value } }) => {
    updateLink(value);
  };

  return (
    <ExpandableSection headerText={header} defaultExpanded={isLink} data-test-id='text-widget-link-section'>
      <div className='link-configuration' style={{ gap: awsui.spaceScaledS }}>
        <label className='section-item-label'>{defaultMessages.url}</label>
        <div className='link-input'>
          <Input value={link} onChange={onLinkTextChange} data-test-id='text-widget-link-input' />
        </div>
      </div>
    </ExpandableSection>
  );
};

export default LinkSettings;
