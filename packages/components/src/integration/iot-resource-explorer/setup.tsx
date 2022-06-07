import { mount } from '@cypress/vue';
import { h } from 'vue';
import { initialize } from '@iot-app-kit/source-iotsitewise';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { applyPolyfills, defineCustomElements } = require('@iot-app-kit/components/loader');
import '../../styles/awsui.css';
import { Components } from '../../components.d';

applyPolyfills().then(() => defineCustomElements());

export const testContainerClassName = 'test-container';
export const renderComponent = ({
  propOverrides,
}: { propOverrides?: Partial<Components.IotResourceExplorer> } = {}) => {
  mount({
    render: function () {
      const { query } = initialize({
        awsCredentials: {
          accessKeyId: 'accessKeyId',
          secretAccessKey: 'secretAccessKey',
        },
        awsRegion: 'us-east-1',
      });
      const containerProps = { class: testContainerClassName };
      const compProps: any = { query: query.assetTree.fromRoot(), ...propOverrides };
      return (
        <div {...containerProps}>
          <iot-resource-explorer {...compProps} />
        </div>
      );
    },
  });
};
