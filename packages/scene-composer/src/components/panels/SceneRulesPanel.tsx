import React, { useCallback, useContext, useState } from 'react';
import { AttributeEditor, Box, Button, FormField, Input, Select, SpaceBetween } from '@awsui/components-react';
import { useIntl } from 'react-intl';

import { useSceneDocument } from '../../store';
import { IRuleBasedMapInternal, IRuleStatementInternal } from '../../store/internalInterfaces';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { validateRuleId } from '../../utils/inputValidationUtils';
import LogProvider from '../../logger/react-logger/log-provider';
import { WidgetRuleMap, WidgetRuleScriptType } from '../../models/SceneModels';
import { AddTag } from '../../assets/scripts/AddTag';
import { KnownComponentType } from '../../interfaces';

import { SceneRuleTargetEditor } from './scene-rule-components/SceneRuleTargetEditor';
import { ExpandableInfoSection } from './CommonPanelComponents';

interface ISceneRuleMapExpandableInfoSectionProps {
  ruleBasedMapId: string;
  ruleMap: IRuleBasedMapInternal;
}

const SceneRuleMapExpandableInfoSection: React.FC<React.PropsWithChildren<ISceneRuleMapExpandableInfoSectionProps>> = ({
  ruleBasedMapId,
  ruleMap,
}: ISceneRuleMapExpandableInfoSectionProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { removeSceneRuleMapById, updateSceneRuleMapById } = useSceneDocument(sceneComposerId);
  const [newRule, setNewRule] = useState<IRuleStatementInternal | undefined>(undefined);
  const intl = useIntl();

  const onRemoveRule = useCallback(
    (ruleIndex) => {
      if (ruleIndex === ruleMap.statements.length) {
        // Temporary new rule
        setNewRule(undefined);
      } else {
        const newRuleMap = {
          statements: [...ruleMap.statements.slice(0, ruleIndex), ...ruleMap.statements.slice(ruleIndex + 1)],
        };
        updateSceneRuleMapById(ruleBasedMapId, newRuleMap);
      }
    },
    [ruleMap],
  );

  const onUpdateRule = useCallback(
    (ruleIndex: number, updatedRule: IRuleStatementInternal) => {
      if (ruleIndex === ruleMap.statements.length) {
        // Temporary new rule
        if (updatedRule.expression.length > 0 && updatedRule.target.length > 0) {
          updateSceneRuleMapById(ruleBasedMapId, { statements: ruleMap.statements.concat(updatedRule) });
          setNewRule(undefined);
        } else {
          setNewRule(updatedRule);
        }
      } else if (ruleIndex >= 0 && ruleIndex < ruleMap.statements.length) {
        const newRuleMap = {
          statements: [
            ...ruleMap.statements.slice(0, ruleIndex),
            updatedRule,
            ...ruleMap.statements.slice(ruleIndex + 1),
          ],
        };

        updateSceneRuleMapById(ruleBasedMapId, newRuleMap);
      }
    },
    [ruleMap],
  );

  const items: IRuleStatementInternal[] = ruleMap.statements.map((rule) => ({
    expression: rule.expression,
    target: rule.target,
  }));
  if (newRule) {
    items.push(newRule);
  }

  return (
    <ExpandableInfoSection title={ruleBasedMapId} defaultExpanded={false}>
      <AttributeEditor
        onAddButtonClick={() => setNewRule({ expression: '', target: '' })}
        onRemoveButtonClick={({ detail: { itemIndex } }) => onRemoveRule(itemIndex)}
        items={items}
        definition={[
          {
            label: intl.formatMessage({ defaultMessage: 'Expression', description: 'Input field label' }),
            control: (item, itemIndex) => (
              <Input
                value={item.expression}
                placeholder={intl.formatMessage({
                  defaultMessage: 'e.g. value > 0',
                  description: 'AttributeEditor control placeholder',
                })}
                onChange={(event) => onUpdateRule(itemIndex, { expression: event.detail.value, target: item.target })}
              />
            ),
          },
          {
            label: intl.formatMessage({ defaultMessage: 'Target', description: 'drop down menu label' }),
            control: (item, itemIndex) => (
              <SceneRuleTargetEditor
                target={item.target}
                onChange={(target) => onUpdateRule(itemIndex, { expression: item.expression, target })}
              />
            ),
          },
        ]}
        disableAddButton={!!newRule}
        addButtonText={intl.formatMessage({ defaultMessage: 'Add new statement', description: 'add Button Text' })}
        removeButtonText={intl.formatMessage({ defaultMessage: 'Remove statement', description: 'remove Button Text' })}
        empty={intl.formatMessage({ defaultMessage: 'No statements', description: 'Rule has no statements' })}
      />
      <Button onClick={() => removeSceneRuleMapById(ruleBasedMapId)}>
        {intl.formatMessage({ defaultMessage: 'Remove Rule', description: 'remove rule Button Text' })}
      </Button>
    </ExpandableInfoSection>
  );
};

const SceneWidgetRuleMapExpandableInfoSection: React.FC<
  React.PropsWithChildren<{ ruleBasedMapId: string; ruleMap: WidgetRuleMap }>
> = ({ ruleBasedMapId, ruleMap }: { ruleBasedMapId: string; ruleMap: WidgetRuleMap }) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { updateSceneWidgetRuleMapById, removeSceneWidgetRuleMapById, getSceneWidgetRuleMapById } =
    useSceneDocument(sceneComposerId);
  const { listSceneRuleMapIds } = useSceneDocument(sceneComposerId);
  const existingRule = getSceneWidgetRuleMapById(ruleBasedMapId);

  const intl = useIntl();

  const ruleMapIds = listSceneRuleMapIds();
  const selectedRuleMapId = ruleMap.ruleId && ruleMapIds.includes(ruleMap.ruleId) ? ruleMap.ruleId : null;

  const ruleOptions = ruleMapIds
    .concat(
      selectedRuleMapId
        ? intl.formatMessage({
            defaultMessage: 'No Rule',
            description: 'signify No rule option to be selected in a drop down menu',
          })
        : [],
    )
    .map((ruleMapId) => ({ label: ruleMapId, value: ruleMapId }));

  const nodeTypeOptions = Object.keys(KnownComponentType).map((type) => ({
    label: type,
    value: type,
  }));

  const scriptTypeOptions = Object.keys(WidgetRuleScriptType).map((type) => ({
    label: type,
    value: type,
  }));

  return (
    <ExpandableInfoSection title={ruleBasedMapId} defaultExpanded={false}>
      <FormField
        data-testid='widget-rule-script-type'
        label={intl.formatMessage({ defaultMessage: 'Script Type', description: 'script type label' })}
      >
        <Select
          data-testid='script-type-select'
          selectedOption={existingRule?.script ? { label: existingRule?.script, value: existingRule?.script } : null}
          onChange={(e) => {
            const nodeTypeFilter = e.detail.selectedOption.value as KnownComponentType;
            if (existingRule) {
              if (nodeTypeFilter) {
                updateSceneWidgetRuleMapById(ruleBasedMapId, { ...existingRule, nodeTypeFilters: [nodeTypeFilter] });
              } else {
                updateSceneWidgetRuleMapById(ruleBasedMapId, { ...existingRule, nodeTypeFilters: undefined });
              }
            }
          }}
          options={scriptTypeOptions}
          selectedAriaLabel={intl.formatMessage({
            defaultMessage: 'Selected',
            description:
              'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
          })}
          disabled={scriptTypeOptions.length === 0}
          placeholder={intl.formatMessage({ defaultMessage: 'Choose a script type', description: 'placeholder' })}
        />
      </FormField>

      {/* TODO: Only AddTag supported currently */}
      {existingRule?.script === WidgetRuleScriptType.AddTag && (
        <>
          <FormField label={intl.formatMessage({ defaultMessage: 'Rule Id', description: 'Form field label' })}>
            <Select
              data-testid='widget-rule-id-select'
              selectedOption={selectedRuleMapId ? { label: selectedRuleMapId, value: selectedRuleMapId } : null}
              onChange={(e) => {
                const ruleMapId = e.detail.selectedOption.value;
                if (existingRule && ruleMapId) {
                  if (ruleMapIds.includes(ruleMapId)) {
                    updateSceneWidgetRuleMapById(ruleBasedMapId, { ...existingRule, ruleId: ruleMapId });
                  } else {
                    updateSceneWidgetRuleMapById(ruleBasedMapId, { ...existingRule, ruleId: undefined });
                  }
                }
              }}
              options={ruleOptions}
              selectedAriaLabel={intl.formatMessage({
                defaultMessage: 'Selected',
                description:
                  'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
              })}
              disabled={ruleMapIds.length === 0}
              placeholder={intl.formatMessage({ defaultMessage: 'Choose a rule', description: 'placeholder' })}
            />
          </FormField>

          <FormField
            data-testid='widget-rule-property-name-filter'
            label={intl.formatMessage({
              defaultMessage: 'Property Name Filter',
              description: 'property name filter label',
            })}
          >
            <Input
              value={(existingRule?.propertyNameFilters || []).at(0) || ''}
              placeholder='Type a propertyName'
              onChange={(event) => {
                existingRule &&
                  updateSceneWidgetRuleMapById(ruleBasedMapId, {
                    ...existingRule,
                    propertyNameFilters: [event.detail.value],
                  });
              }}
            />
          </FormField>

          <FormField
            data-testid='widget-rule-node-type-filter'
            label={intl.formatMessage({ defaultMessage: 'Node Type Filter', description: 'node type filter label' })}
          >
            <Select
              data-testid='node-type-filter-select'
              selectedOption={
                (existingRule?.nodeTypeFilters || []).at(0)
                  ? { label: existingRule?.nodeTypeFilters!.at(0), value: existingRule?.nodeTypeFilters!.at(0) }
                  : null
              }
              onChange={(e) => {
                const nodeTypeFilter = e.detail.selectedOption.value as KnownComponentType;
                if (existingRule) {
                  if (nodeTypeFilter) {
                    updateSceneWidgetRuleMapById(ruleBasedMapId, {
                      ...existingRule,
                      nodeTypeFilters: [nodeTypeFilter],
                    });
                  } else {
                    updateSceneWidgetRuleMapById(ruleBasedMapId, { ...existingRule, nodeTypeFilters: undefined });
                  }
                }
              }}
              options={[{ label: 'No filter', value: undefined }, ...nodeTypeOptions]}
              selectedAriaLabel={intl.formatMessage({
                defaultMessage: 'Selected',
                description:
                  'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
              })}
              disabled={nodeTypeOptions.length === 0}
              placeholder={intl.formatMessage({ defaultMessage: 'Choose a node type', description: 'placeholder' })}
            />
          </FormField>
        </>
      )}
      <Button onClick={() => removeSceneWidgetRuleMapById(ruleBasedMapId)}>
        {intl.formatMessage({ defaultMessage: 'Remove Widget Rule', description: 'remove rule Button Text' })}
      </Button>
    </ExpandableInfoSection>
  );
};

export const SceneRulesPanel: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const {
    getSceneRuleMapById,
    listSceneRuleMapIds,
    updateSceneRuleMapById,
    listSceneWidgetRuleMapIds,
    getSceneWidgetRuleMapById,
    updateSceneWidgetRuleMapById,
  } = useSceneDocument(sceneComposerId);
  const [newRuleBasedMapId, setNewRuleBasedMapId] = useState<string>('');
  const [newWidgetRuleId, setNewWidgetRuleId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const intl = useIntl();

  const onAddRuleClick = useCallback(() => {
    const valid = validateRuleId(newRuleBasedMapId);
    setErrorMessage('');
    if (valid) {
      updateSceneRuleMapById(newRuleBasedMapId, { statements: [] });
      setNewRuleBasedMapId('');
    } else {
      setErrorMessage(
        intl.formatMessage({
          defaultMessage: 'Rule Id must be alphanumeric can contain underscore and hyphen and ends with alphanumeric',
          description: 'Error message wrong input',
        }),
      );
    }
  }, [newRuleBasedMapId]);

  return (
    <LogProvider namespace='SceneRulesPanel'>
      <Box fontSize='heading-s' margin={{ horizontal: 'm', bottom: 's' }}>
        Data Binding Rules
      </Box>
      {listSceneRuleMapIds()
        .filter((key) => getSceneRuleMapById(key) !== undefined)
        .map((key) => (
          <SceneRuleMapExpandableInfoSection key={key} ruleBasedMapId={key} ruleMap={getSceneRuleMapById(key)!} />
        ))}

      <Box padding={{ left: 'm', right: 'm', top: 'xxs', bottom: 'xxs' }}>
        <SpaceBetween size='s'>
          <FormField
            data-testid='addNewRuleField'
            label={intl.formatMessage({ defaultMessage: 'Rule Id', description: 'rule Id label' })}
            errorText={errorMessage}
          >
            <Input
              value={newRuleBasedMapId}
              onChange={(event) => {
                setNewRuleBasedMapId(event.detail.value);
              }}
            />
          </FormField>
          <Button data-testid='addNewRuleButton' onClick={onAddRuleClick}>
            {intl.formatMessage({ defaultMessage: 'Add New Rule', description: 'add new rule Button Text' })}
          </Button>
        </SpaceBetween>
      </Box>

      <Box fontSize='heading-s' margin={{ horizontal: 'm', bottom: 's', top: 'm' }}>
        Widget Rules
      </Box>

      {listSceneWidgetRuleMapIds()
        .filter((key) => getSceneWidgetRuleMapById(key) !== undefined)
        .map((key) => (
          <SceneWidgetRuleMapExpandableInfoSection
            key={key}
            ruleBasedMapId={key}
            ruleMap={getSceneWidgetRuleMapById(key)!}
          />
        ))}

      <Box padding={{ left: 'm', right: 'm', top: 'xxs', bottom: 'xxs' }}>
        <SpaceBetween size='s'>
          <FormField
            data-testid='addNewWidgetRuleField'
            label={intl.formatMessage({ defaultMessage: 'Widget Rule Id', description: 'rule Id label' })}
            errorText={errorMessage}
          >
            <Input
              value={newWidgetRuleId}
              onChange={(event) => {
                setNewWidgetRuleId(event.detail.value);
              }}
            />
          </FormField>
          <Button
            data-testid='addNewWidgetRuleButton'
            onClick={() => {
              updateSceneWidgetRuleMapById(newWidgetRuleId, { script: WidgetRuleScriptType.AddTag });
              setNewWidgetRuleId('');
            }}
          >
            {intl.formatMessage({ defaultMessage: 'Add New Widget Rule', description: 'add new rule Button Text' })}
          </Button>
        </SpaceBetween>
      </Box>
    </LogProvider>
  );
};
