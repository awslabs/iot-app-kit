import { componentTypeToId } from '../../common/entityModelConstants';
import { KnownComponentType } from '../../interfaces';

import {
  createSubModelRefEntityComponent,
  parseSubModelRefComp,
  updateSubModelRefEntityComponent,
} from './subModelRefComponent';

describe('createSubModelRefEntityComponent', () => {
  it('should return expected subModelRef component', () => {
    const result = createSubModelRefEntityComponent({
      type: KnownComponentType.SubModelRef,
      selector: 'abc',
      parentRef: 'parent',
    });
    const expected = {
      componentTypeId: componentTypeToId[KnownComponentType.SubModelRef],
      properties: {
        selector: {
          value: { stringValue: 'abc' },
        },
        parentRef: {
          value: { relationshipValue: { targetEntityId: 'parent' } },
        },
      },
    };

    expect(result).toEqual(expected);
  });
});

describe('updateSubModelRefEntityComponent', () => {
  it('should update a sub model ref component', () => {
    const result = updateSubModelRefEntityComponent({
      type: KnownComponentType.SubModelRef,
      selector: 'abc',
      parentRef: 'parent',
    });
    const expected = {
      componentTypeId: componentTypeToId[KnownComponentType.SubModelRef],
      propertyUpdates: {
        selector: {
          value: { stringValue: 'abc' },
        },
        parentRef: {
          value: { relationshipValue: { targetEntityId: 'parent' } },
        },
      },
    };

    expect(result).toEqual(expected);
  });
});

describe('parseSubModelRefComponent', () => {
  it('should parse to expected sub model ref component', () => {
    const result = parseSubModelRefComp({
      componentTypeId: componentTypeToId[KnownComponentType.SubModelRef],
      properties: [
        {
          propertyName: 'selector',
          propertyValue: 'abc',
        },
      ],
    });
    const expected = {
      ref: expect.any(String),
      type: KnownComponentType.SubModelRef,
      selector: 'abc',
    };

    expect(result).toEqual(expected);
  });

  it('should return undefined when selector is not found', () => {
    const result = parseSubModelRefComp({
      componentTypeId: componentTypeToId[KnownComponentType.SubModelRef],
      properties: [],
    });

    expect(result).toBeUndefined();
  });
});
