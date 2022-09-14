import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  AttributeEditor,
  Box,
  ExpandableSection,
  FormField,
  Grid,
  Input,
  Select,
  SelectProps,
  SpaceBetween,
  TextContent,
} from '@awsui/components-react';
import styled from 'styled-components';
import * as awsui from '@awsui/design-tokens';

import useLifecycleLogging from '../../logger/react-logger/hooks/useLifecycleLogging';

export type Triplet<T> = [T, T, T];

// CSS hack to hide the add button
export const ReadOnlyAttributeEditor = styled(AttributeEditor)`
  button {
    display: none !important;
  }
` as typeof AttributeEditor;

export function NumericInput(props: {
  value: number;
  setValue: (val: number) => void;
  toStr: (val: number) => string;
  fromStr: (str: string) => number;
}) {
  const [strValue, setStrValue] = useState(props.toStr(props.value));

  useEffect(() => {
    setStrValue(props.toStr(props.value));
  }, [props.value]);

  return (
    <Input
      value={strValue}
      onChange={(event) => {
        setStrValue(event.detail.value);
      }}
      onBlur={() => {
        props.setValue(props.fromStr(strValue));
      }}
    />
  );
}

export const MatrixCell = styled.div`
  display: flex;
  align-items: baseline;
  align-content: center;
`;

export const SectionBorder = styled.div`
  height: 1px;
  align-self: stretch;
  margin: 10px 0px;
  background: ${awsui.colorBorderDividerDefault};
`;

export const MatrixLabel = styled.div`
  flex: none;
  padding-right: 8px;
`;

export const MatrixCellInputWrapper = styled.div`
  flex: 1;
`;

export interface Matrix3XInputGridProps<T> {
  name: string;
  labels: Triplet<string>;
  values: Triplet<T>;
  disabled?: Triplet<boolean>;
  onChange: (values: Triplet<T>) => void;
  toStr: (v: T) => string;
  fromStr: (str: string) => T;
  readonly?: Triplet<boolean>;
}

export function Matrix3XInputGrid<T>({
  name,
  labels,
  values,
  disabled,
  toStr,
  fromStr,
  onChange,
  readonly,
}: Matrix3XInputGridProps<T>) {
  const intl = useIntl();
  if (labels.length !== 3 || values.length !== 3) {
    throw new Error(
      intl.formatMessage({
        defaultMessage: 'Error: invalid props to Matrix3XInputGrid, labels and values must be of length 3',
        description: 'Error message',
      }),
    );
  }

  const log = useLifecycleLogging('Matrix3XInputGrid');
  const [internalValues, setInternalValues] = useState(values.map(toStr));
  const [dirty, setDirty] = useState(false);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    if (dirty) {
      // TODO: debounce?
      // TODO: better error handling
      let newValues: Triplet<T>;
      try {
        newValues = internalValues.map(fromStr) as Triplet<T>;
      } catch (error) {
        log?.error('failed to convert the text to value, ignoring the update');
        return;
      }
      onChange(newValues);
      setDirty(false);
    }
  }, [internalValues, dirty]);

  useEffect(() => {
    if (!dirty && !focus) {
      setInternalValues(values.map(toStr));
    }
  }, [values, dirty, focus]);

  return (
    <FormField label={name}>
      <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}>
        {values.map((value, index) => (
          <MatrixCell key={index}>
            <MatrixLabel>
              <TextContent>
                <p>{labels[index]}</p>
              </TextContent>
            </MatrixLabel>
            <MatrixCellInputWrapper>
              {readonly && readonly[index] && <TextContent> {internalValues[index]} </TextContent>}
              {!(readonly && readonly[index]) && (
                <Input
                  controlId={`${name}_input_${labels[index]}`}
                  value={internalValues[index]}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  onChange={(event) => {
                    const updatedInternalValue = [...internalValues] as Triplet<string>;
                    updatedInternalValue[index] = event.detail.value;
                    setInternalValues(updatedInternalValue);
                    setDirty(true);
                  }}
                  disabled={disabled && disabled[index]}
                ></Input>
              )}
            </MatrixCellInputWrapper>
          </MatrixCell>
        ))}
      </Grid>
    </FormField>
  );
}

export const ExpandableSectionWithBorder = styled(ExpandableSection)`
  border-bottom: 1px solid ${awsui.colorBorderDividerDefault};

  // style the header
  & > div:first-child {
    background-color: ${awsui.colorBackgroundContainerHeader};
    user-select: none;
  }
`;

export interface ExpandableInfoSectionProps {
  title: string;
  withoutSpaceBetween?: boolean;
  defaultExpanded?: boolean;
}

export const ExpandableInfoSection: React.FC<React.PropsWithChildren<ExpandableInfoSectionProps>> = ({
  title,
  withoutSpaceBetween = false,
  defaultExpanded = true,
  children,
}: React.PropsWithChildren<ExpandableInfoSectionProps>) => {
  return (
    <ExpandableSectionWithBorder
      defaultExpanded={defaultExpanded}
      header={
        <TextContent>
          <strong style={{ color: awsui.colorTextFormSecondary }}>{title}</strong>
        </TextContent>
      }
    >
      <Box padding={{ left: 'm', right: 'm', top: 'xxs', bottom: 'xxs' }}>
        {withoutSpaceBetween && children}
        {!withoutSpaceBetween && <SpaceBetween size='s'>{children}</SpaceBetween>}
      </Box>
    </ExpandableSectionWithBorder>
  );
};

export const DynamicSelect: React.FC<SelectProps> = (props) => {
  const [dynamicOptions, setDynamicOptions] = useState(props.options);

  useEffect(() => {
    const optionLabels = dynamicOptions?.map((option) => option.label);
    const selectedOptionLabel = props.selectedOption?.label;
    if (!optionLabels?.includes(selectedOptionLabel)) {
      // Add it to the options
      const updatedOptions = [
        ...(dynamicOptions ?? []),
        {
          label: selectedOptionLabel,
          value: props.selectedOption?.value,
        },
      ];

      setDynamicOptions(
        updatedOptions.sort((a, b) => {
          if (a.label! < b.label!) {
            return -1;
          } else if (a.label! === b.label!) {
            return 0;
          } else {
            return 1;
          }
        }),
      );
    }
  }, [props.selectedOption, props.options]);

  return <Select {...props} options={dynamicOptions} />;
};
