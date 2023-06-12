# Getting Started with Sample App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), and configured to run on AWS Amplify.

It creates the following resources in your AWS Account for running the application:

┌──────────┬───────────────────────────┬───────────┬───────────────────┐
│ Category │ Resource name             │ Operation │ Provider plugin   │
├──────────┼───────────────────────────┼───────────┼───────────────────┤
│ Api      │ AlarmDataGenerator        │ Create    │ awscloudformation │
├──────────┼───────────────────────────┼───────────┼───────────────────┤
│ Auth     │ appkitdemo7227c365        │ Create    │ awscloudformation │
├──────────┼───────────────────────────┼───────────┼───────────────────┤
│ Custom   │ CookieFactoryTimeseriesDB │ Create    │ awscloudformation │
├──────────┼───────────────────────────┼───────────┼───────────────────┤
│ Function │ AlarmDataLambda           │ Create    │ awscloudformation │
├──────────┼───────────────────────────┼───────────┼───────────────────┤
│ Hosting  │ amplifyhosting            │ Create    │ awscloudformation │
└──────────┴───────────────────────────┴───────────┴───────────────────┘

## New AWS Account Setup

These steps are for a fresh AWS Account, you will need to initialize the Amplify CLI first to be able to setup the environment. Follow the [Amplify onboarding instructions](https://docs.amplify.aws/cli/start/install/#configure-the-amplify-cli) to initialize your CLI.

After this, you likely want to deploy the base application before you get started.

```bash
cd examples/react-app
amplify env add dev # follow prompts to initialize your dev environment
amplify publish # deploys both front-end and back end steps
```

Once you've published for the first time, there are a couple manual steps you need to perform in the Amplify console to get the Application to behave as desired.

### Configure Single Page App (SPA) Routing
This example app uses `react-router` and is based on client side routing, so you need to configure amplify to direct all traffic to the root of the application directory.

Full [documentation here](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html#redirects-for-single-page-web-apps-spa), but essentially this you need to add a URL Rewrite rule in the Amplify UI:

Original Address: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>`
Destination Address: '/index.html'
Redirect Type: 200

### Configure Authentication
By default, this will setup a barebones Cognito user pool that uses basic auth. By going to the website, any user will be able to go and signup for a user account, making it easy to get started with end to end development. You can run `amplify configure auth` to change the default auth settings. Specifically, you can configure any authentication method supported by amplify and Cognito, including social providers, corporate SSO, etc.

More information here: https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/

By default, authenticated users are given access to all resources created through this amplify stack (listed above), as well as access to AWS Iot TwinMaker service and necessary permissions to load a digital twin. You can always adjust these permissions by editing the [policy override](/amplify/backend/awscloudformation/override.ts).

## Additional Steps

To get the Digital Twin Scene loading, this application assumes you've deployed the [Sample Cookie Factory Workspace](https://github.com/aws-samples/aws-iot-twinmaker-samples#deploying-the-sample-cookie-factory-workspace). You DO NOT need to do any of the steps involving Grafana, this is example is a separate hosting option.

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

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
