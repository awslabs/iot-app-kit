import {
  AttributeEditor,
  Box,
  Button,
  FormField,
  Input,
  type InputProps,
  SpaceBetween,
  Textarea,
} from '@cloudscape-design/components';
import { useCallback, useContext, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import LogProvider from '../../logger/react-logger/log-provider';
import { useSceneDocument } from '../../store';
import { type IRuleBasedMapInternal, type IRuleStatementInternal } from '../../store/internalInterfaces';
import { validateRuleId } from '../../utils/inputValidationUtils';

import { ExpandableInfoSection } from './CommonPanelComponents';
import { SceneRuleTargetEditor } from './scene-rule-components/SceneRuleTargetEditor';

interface ISceneRuleMapExpandableInfoSectionProps {
  ruleBasedMapId: string;
  ruleMap: IRuleBasedMapInternal;
}

export const SceneRuleMapExpandableInfoSection: React.FC<
  React.PropsWithChildren<ISceneRuleMapExpandableInfoSectionProps>
> = ({ ruleBasedMapId, ruleMap }: ISceneRuleMapExpandableInfoSectionProps) => {
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
    targetMetadata: rule.targetMetadata,
  }));
  if (newRule) {
    items.push(newRule);
  }
  //TODO: When we migrate from polaris to cloudscape, just pass these as normal props to AttributeEditor
  const a11yProps = {
    i18nStrings: {
      itemRemovedAriaLive: intl.formatMessage({
        defaultMessage: 'Removed statement',
        description: 'Aria live announcement for when a statement is removed',
      }),
    },
    removeButtonAriaLabel: (statement: IRuleStatementInternal) =>
      `${intl.formatMessage({
        defaultMessage: 'Remove statement',
        description: 'Aria label for remove statement button',
      })} ${statement.expression}`,
  };

  return (
    <ExpandableInfoSection title={ruleBasedMapId} defaultExpanded={false}>
      <AttributeEditor
        {...a11yProps}
        onAddButtonClick={() => setNewRule({ expression: '', target: '', targetMetadata: {} })}
        onRemoveButtonClick={({ detail: { itemIndex } }) => onRemoveRule(itemIndex)}
        items={items}
        definition={[
          {
            label: intl.formatMessage({ defaultMessage: 'Expression', description: 'Input field label' }),
            control: (item, itemIndex) => (
              <Textarea
                data-testid='rule-expression'
                value={item.expression}
                placeholder={intl.formatMessage({
                  defaultMessage: 'e.g. value > 0',
                  description: 'AttributeEditor control placeholder',
                })}
                onChange={(event) =>
                  onUpdateRule(itemIndex, {
                    expression: event.detail.value,
                    target: item.target,
                    targetMetadata: item.targetMetadata,
                  })
                }
              />
            ),
          },
          {
            label: intl.formatMessage({ defaultMessage: 'Target', description: 'drop down menu label' }),
            control: (item, itemIndex) => (
              <SceneRuleTargetEditor
                target={item.target}
                targetMetadata={item.targetMetadata}
                onChange={(target, targetMetadata) => {
                  onUpdateRule(itemIndex, { expression: item.expression, target, targetMetadata });
                }}
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

export const SceneRulesPanel: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { getSceneRuleMapById, listSceneRuleMapIds, updateSceneRuleMapById } = useSceneDocument(sceneComposerId);
  const [newRuleBasedMapId, setNewRuleBasedMapId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const inputRef = useRef<InputProps.Ref | null>(null);
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
      inputRef.current?.focus();
    }
  }, [newRuleBasedMapId]);

  return (
    <LogProvider namespace='SceneRulesPanel'>
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
              data-testid='input-rule'
              value={newRuleBasedMapId}
              onChange={(event) => {
                setNewRuleBasedMapId(event.detail.value);
              }}
              ref={inputRef}
            />
          </FormField>
          <Button data-testid='addNewRuleButton' onClick={onAddRuleClick}>
            {intl.formatMessage({ defaultMessage: 'Add New Rule', description: 'add new rule Button Text' })}
          </Button>
        </SpaceBetween>
      </Box>
    </LogProvider>
  );
};
