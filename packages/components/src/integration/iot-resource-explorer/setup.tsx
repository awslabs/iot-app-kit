import { mount } from '@cypress/vue';
import { h } from 'vue';
import { initialize, query } from '@iot-app-kit/core';
const { applyPolyfills, defineCustomElements } = require('@iot-app-kit/components/loader');
import '../../styles/awsui.css';
import iotsitewise = query.iotsitewise;

applyPolyfills().then(() => defineCustomElements());

export const testContainerClassName = 'test-container';
export const renderComponent = () => {
  mount({
    data: () => {
      return {
        query: iotsitewise.assetTree.fromRoot(),
      };
    },
    render: function () {
      const newDefaultAppKit = initialize({
        awsCredentials: {
          accessKeyId: 'accessKeyId',
          secretAccessKey: 'secretAccessKey',
        },
        awsRegion: 'us-east-1',
      });
      const containerProps = { class: testContainerClassName };
      const compProps: any = { appKit: newDefaultAppKit, query: this.query };
      return (
        <div {...containerProps}>
          <iot-resource-explorer {...compProps} />
        </div>
      );
    },
  });
};
