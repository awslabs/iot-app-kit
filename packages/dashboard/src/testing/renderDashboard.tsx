import { mount } from '@cypress/vue';
import { h } from 'vue';
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const { defineCustomElements } = require('@iot-app-kit/dashboard/loader');

defineCustomElements();

export const renderDashboard = () => {
  mount({
    render: function () {
      return <testing-ground />;
    },
  });
};
