import React from 'react';
import { Input } from '@awsui/components-react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { ComponentEditor, DefaultComponentEditor } from '../../../src/components/panels/ComponentEditor';
import { KnownComponentType } from '../../../src/interfaces';
import { AnchorComponentEditor } from '../../../src/components/panels/scene-components/AnchorComponentEditor';
import { LightComponentEditor } from '../../../src/components/panels/scene-components/LightComponentEditor';
import { ColorOverlayComponentEditor } from '../../../src/components/panels/scene-components/ColorOverlayComponentEditor';
import { ModelRefComponentEditor } from '../../../src/components/panels/scene-components/ModelRefComponentEditor';
import { MotionIndicatorComponentEditor } from '../../../src/components/panels/scene-components/MotionIndicatorComponentEditor';

configure({ adapter: new Adapter() });
describe('ComponentEditor renders correct component', () => {
  it('render DefaultComponentEditor correctly', async () => {
    const wrapper = shallow(<DefaultComponentEditor node={{} as any} component={{ ref: 'refId' } as any} />);

    const inputProps = wrapper.find(Input).props();

    expect(inputProps.value).toBe('refId');
  });

  it('render correct component type editor', async () => {
    let wrapper = shallow(
      <ComponentEditor node={{} as any} component={{ ref: 'refId', type: KnownComponentType.Tag }} />,
    );
    expect(wrapper.find(AnchorComponentEditor).length).toBe(1);

    wrapper = shallow(
      <ComponentEditor node={{} as any} component={{ ref: 'refId', type: KnownComponentType.Light }} />,
    );
    expect(wrapper.find(LightComponentEditor).length).toBe(1);

    wrapper = shallow(
      <ComponentEditor node={{} as any} component={{ ref: 'refId', type: KnownComponentType.ModelShader }} />,
    );
    expect(wrapper.find(ColorOverlayComponentEditor).length).toBe(1);

    wrapper = shallow(
      <ComponentEditor node={{} as any} component={{ ref: 'refId', type: KnownComponentType.ModelRef }} />,
    );
    expect(wrapper.find(ModelRefComponentEditor).length).toBe(1);

    wrapper = shallow(
      <ComponentEditor node={{} as any} component={{ ref: 'refId', type: KnownComponentType.MotionIndicator }} />,
    );
    expect(wrapper.find(MotionIndicatorComponentEditor).length).toBe(1);

    wrapper = shallow(<ComponentEditor node={{} as any} component={{ ref: 'refId', type: 'unknown' }} />);
    expect(wrapper.find(DefaultComponentEditor).length).toBe(1);
  });
});
