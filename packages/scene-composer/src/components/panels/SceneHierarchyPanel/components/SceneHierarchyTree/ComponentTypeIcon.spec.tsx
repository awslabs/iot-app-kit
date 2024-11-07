import { create } from 'react-test-renderer';

import { Camera, Light, Modelref, Tag } from '../../../../../assets/auto-gen/icons';

import ComponentTypeIcon from './ComponentTypeIcon';

describe('ComponentTypeIcon', () => {
  [
    ['Camera', { key: 'Camera', icon: Camera }],
    ['Light', { key: 'Light', icon: Light }],
    ['ModelRef', { key: 'ModelRef', icon: Modelref }],
    ['SubModelRef', { key: 'SubModelRef', icon: Modelref }],
    ['Tag', { key: 'Tag', icon: Tag }],
    ['Empty', { key: '', icon: <></> }],
  ].forEach((value) => {
    it(`it should render the ${value[0]} svg`, () => {
      const { key } = value[1] as any;
      const container = create(ComponentTypeIcon({ type: key }));

      expect(container).toMatchSnapshot();
    });
  });
});
