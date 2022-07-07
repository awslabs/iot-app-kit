# IotRociWebGLRenderer

# TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO 

## Version Set
Please use **IotRociConsole/development-preview**

```bash
brazil workspace use --versionset IotRociConsole/development-preview
```

## Prerequisites
* RimRaf for brazil-build clean
  ```bash
  npm install -g rimraf
  ```

## Build

This package uses NpmPrettyMuch as the build system.

Please follow this wiki to learn more details about the NpmPrettyMuch build system.
https://w.amazon.com/bin/view/NpmPrettyMuch/GettingStarted/v1

**Build command**

Run the following command to build the package.
The library will be built and copied to the `dist` folder.

```bash
brazil-build
```

**Release command**

Please run this command before commit to verify the build.

```bash
brazil-build release
```

You can use the following tool to analyze the releasing bundle content:

```bash
npm install -g source-map-explorer # run this only once

source-map-explorer dist/index.js
```

**Test using example app**

```bash
cd example
bb install # only need to run once for the first time
bb start
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
brazil-build install # only needed first time
brazil-build storybook
```

### Additional Assets
1. Download the `glb`s ([Cookie_Factory_Warehouse_Building_No_Site.glb](https://amazon.awsapps.com/workdocs/index.html#/document/b9ed1946d42beaa37f555414b5359718b66f374a2b123b1079ba2ea99becc0fd), [Pallet_Jack.glb](https://amazon.awsapps.com/workdocs/index.html#/document/af595d8da6e165d5f0083dbb1457b881ffe61689c8b4bfac3c85f3672f1c1c53)), and place these in the `dist` folder.
2. Copy the folder `hdri` from IotRociConsole ([link](https://code.amazon.com/packages/IotRociConsole/trees/mainline/--/static/hdri)) into the `dist` folder (include `hdri` folder itself in the path).

## Debugging
Scene composer is embedded with a custom logging system based on [debugjs](https://www.npmjs.com/package/debug). With this being a complex component with lots of potential things going on, this system allows you to filter logs based on more specific attributes, and ultimately reduces noise.

What you will notice is by default, there are very few messages in the browser console, this is because they are hidden by default from the end user, so you need to enable them in local storage. To do this, run this command in your browser console:

```javascript
localStorage.debug = '*'; // by default gives you all logging output
localStorage.debug = '*,-verbose:*'; // don't show verbose logging
localStorage.debug = 'ruleEvaluator*'; // only show messages related to the ruleEvaluator component
```
