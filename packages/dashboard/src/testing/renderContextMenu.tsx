import { mount } from '@cypress/vue';
import { h } from 'vue';
import { DefaultDashboardMessages } from '../messages';
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const { defineCustomElements } = require('@iot-app-kit/dashboard/loader');

defineCustomElements();

const noop = () => {};

export const renderContextMenu = () => {
  mount({
    render: function () {
      return (
        <div
          id="context-menu-target"
          style={{
            height: '10px',
            width: '10px',
          }}
        >
          <iot-dashboard-context-menu
            messageOverrides={DefaultDashboardMessages}
            actions={{
              onCopy: noop(),
              onPaste: noop(),
              onDelete: noop(),
              onSendToBack: noop(),
              onBringToFront: noop(),
            }}
            hasCopiedWidgets
            hasSelectedWidgets
          />
        </div>
      );
    },
  });
};
