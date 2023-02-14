import React, { FC } from 'react';
import { ExpandableSection, Grid, Input, InputProps, Toggle } from '@cloudscape-design/components';
import { DashboardMessages } from '../../../../messages';
import { useTextWidgetInput } from '../../utils';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import './index.scss';

export type LinkComponentProp = {
  messageOverride: DashboardMessages;
};
const LinkSettings: FC<LinkComponentProp> = ({
  messageOverride: {
    sidePanel: { linkSettings },
  },
}) => {
  const [link = '', updateLink] = useTextWidgetInput('link');
  const [isLink = false, toggleIsLink] = useTextWidgetInput('isLink');

  const header = (
    <div className='expandable-section-header'>
      <span>{linkSettings.title}</span>
      <div onClick={(e) => e.stopPropagation()}>
        <Toggle
          checked={isLink}
          onChange={({ detail }) => {
            toggleIsLink(detail.checked);
          }}
          data-test-id='text-widget-create-link-toggle'
        >
          {linkSettings.toggle}
        </Toggle>
      </div>
    </div>
  );
  const onLinkTextChange: NonCancelableEventHandler<InputProps.ChangeDetail> = ({ detail: { value } }) =>
    updateLink(value);
  return (
    <ExpandableSection headerText={header} data-test-id='text-widget-link-section'>
      <Grid gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
        <label className='section-item-label'>{linkSettings.url}</label>
        <div>
          <Input value={link} onChange={onLinkTextChange} data-test-id='text-widget-link-input' />
        </div>
      </Grid>
    </ExpandableSection>
  );
};

export default LinkSettings;
