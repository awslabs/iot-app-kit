## Note

**This package includes some code from other libraries listed in THIRD-PARTY-LICENSES.**

# `@iot-app-kit/scene-composer`

**Build command**

Run the following command to build the package.
The library will be built and copied to the `dist` folder.

```bash
npm run build
```

**Analyze command**

You can use the following tool to analyze the releasing bundle content:

```bash
npm install -g source-map-explorer # run this only once

source-map-explorer dist/index.js
```

## Storybook

First, make a copy of the .env.example as .env, which will be loaded by
storybook to get the credentials to AWS for testing. Update the .env file with
the AWS credentials you get, typically from ada. Below is a one-liner to get
the .env settings.

```bash
ada cred print --account <ACCOUNT_ID> --role <ROLE> | jq -r '"STORYBOOK_ACCESS_KEY_ID=" + .AccessKeyId, "STORYBOOK_SECRET_ACCESS_KEY=" + .SecretAccessKey, "STORYBOOK_SESSION_TOKEN=" + .SessionToken'
```

To make the storybook site run:

```bash
npm run bootstrap # only needed first time and run at repo root level
npm run build-storybook # run at this package
npm run storybook # run at this package
```

## Debugging
Scene composer is embedded with a custom logging system based on [debugjs](https://www.npmjs.com/package/debug). With this being a complex component with lots of potential things going on, this system allows you to filter logs based on more specific attributes, and ultimately reduces noise.

What you will notice is by default, there are very few messages in the browser console, this is because they are hidden by default from the end user, so you need to enable them in local storage. To do this, run this command in your browser console:

```javascript
localStorage.debug = '*'; // by default gives you all logging output
localStorage.debug = '*,-verbose:*'; // don't show verbose logging
localStorage.debug = 'ruleEvaluator*'; // only show messages related to the ruleEvaluator component
```
