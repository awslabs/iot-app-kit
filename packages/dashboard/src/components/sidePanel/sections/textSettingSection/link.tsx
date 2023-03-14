import React from 'react';
import merge from 'lodash/merge';
import { ExpandableSection, Grid, Input, Toggle } from '@cloudscape-design/components';
import { useWidgetLense } from '../../utils/useWidgetLense';
import './index.css';
import type { FC } from 'react';
import type { InputProps } from '@cloudscape-design/components';
import type { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import type { TextWidget } from '~/customization/widgets/types';

const defaultMessages = {
  title: 'Link',
  toggle: 'Create link',
  url: 'URL',
};

const LinkSettings: FC<TextWidget> = (widget) => {
  const [link = '', updateLink] = useWidgetLense<TextWidget, string | undefined>(
    widget,
    (w) => w.properties.href,
    (w, href) => merge(w, { properties: { href } })
  );

  const [isLink = false, toggleIsLink] = useWidgetLense<TextWidget, boolean | undefined>(
    widget,
    (w) => w.properties.isUrl,
    (w, isUrl) => merge(w, { properties: { isUrl } })
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
    <ExpandableSection headerText={header} data-test-id='text-widget-link-section'>
      <Grid gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
        <label className='section-item-label'>{defaultMessages.url}</label>
        <div>
          <Input value={link} onChange={onLinkTextChange} data-test-id='text-widget-link-input' />
        </div>
      </Grid>
    </ExpandableSection>
  );
};

export default LinkSettings;
