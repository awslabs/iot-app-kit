# Getting Started with Sample App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup AWS credentials

1. Make a copy of the `.env.local.example` as `.env.local`, which will be loaded by the app to get the credentials for testing. 

2. Update the `.env.local` file with the AWS credentials you get.

## Install the latest @iot-app-kit/* packages built locally

1. Build all the packages from the root of this `iot-app-kit` repository and link them with:

```sh
npm run bootstrap
npm run link
```

2. Come back to `iot-app-kit/examples/react-app`, temporarily remove all dependencies for `@iot-app-kit/*` from `package.json` and install the other dependencies with:

```sh
npm install
```

3. Add all the `@iot-app-kit/*` dependencies back to `package.json` and link them to the latest build with:

```sh
npm link @iot-app-kit/core @iot-app-kit/components @iot-app-kit/react-components @iot-app-kit/related-table @iot-app-kit/scene-composer @iot-app-kit/source-iotsitewise @iot-app-kit/source-iottwinmaker @iot-app-kit/table
```

4. To solve the duplicate React issue due to link, go to the root of this `iot-app-kit` repository, and run:

```sh
npm link ./examples/react-app/node_modules/react ./examples/react-app/node_modules/react-dom
```

5. Come back to `iot-appkit/examples/react-app`, build and start the app with:

```sh
npm run build
npm run start
```

## Note

1. The `react-app/src/config.ts` file contains placeholder & example ids that will be used to load data when the app is running. Make sure to update them to real values.

2. If your local server is not started on `http://localhost:3000`, then update the `publicPath` values in `config-overrides.js` file to match yours.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
