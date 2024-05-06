/* istanbul ignore file */ // Ignored because this isn't visible in production builds
import React from 'react';
import { useIntl } from 'react-intl';
import { FormField, Input } from '@cloudscape-design/components';
import { Mesh } from 'three';

import { getGlobalSettings } from '../../../../common/GlobalSettings';
import { ExpandableInfoSection } from '../../CommonPanelComponents';
import useSelectedNode from '../../../../hooks/useSelectedNode';

const DebugInfoPanel = () => {
  const { debugMode } = getGlobalSettings();
  const { formatMessage } = useIntl();
  const { selectedSceneNode, getSelectedObject } = useSelectedNode();
  const selectedObject = getSelectedObject();

  return debugMode ? (
    <></>
  ) : (
    <ExpandableInfoSection
      title={formatMessage({ defaultMessage: 'Debug Info', description: 'Section title' })}
      defaultExpanded={false}
    >
      <FormField label={formatMessage({ defaultMessage: 'Ref', description: 'Form field label' })}>
        <Input disabled value={selectedSceneNode?.ref || ''}></Input>
      </FormField>

      {!!selectedObject && selectedObject instanceof Mesh && (
        <FormField
          label={formatMessage({
            defaultMessage: 'Material Details',
            description: 'Form section listing out properties about a 3D models materials and textures',
          })}
        >
          <pre>
            <code>{JSON.stringify(selectedObject.material, null, 2)}</code>
          </pre>
        </FormField>
      )}
    </ExpandableInfoSection>
  );
};

DebugInfoPanel.displayName = 'DebugInfoPanel';

export default DebugInfoPanel;
