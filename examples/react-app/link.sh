#!/bin/bash

cd ../..

npm run bootstrap
npm run link

cd examples/react-app

npm install

npm link @iot-app-kit/core @iot-app-kit/components @iot-app-kit/react-components @iot-app-kit/related-table @iot-app-kit/scene-composer @iot-app-kit/source-iotsitewise @iot-app-kit/source-iottwinmaker @iot-app-kit/table

cd ../..

npm link ./examples/react-app/node_modules/react ./examples/react-app/node_modules/react-dom

cd examples/react-app

npm run build
npm run start