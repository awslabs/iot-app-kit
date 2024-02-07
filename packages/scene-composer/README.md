## Note

**This package includes some code from other libraries listed in THIRD-PARTY-LICENSES.**

# `@iot-app-kit/scene-composer`

**Build command**

Run the following command to build the package.
The library will be built and copied to the `dist` folder.

```bash
npm run build
```

**UI Tests**

Pre-requisites: You need to have [Docker](https://docs.docker.com/get-docker/) installed locally to run UI Tests, we rely on it to provide the necessary browsers to generate consistent screenshots.

To setup the docker image, there's a post install script, so you may need to trigger it with:

```bash
npm install

# Or if you don't want to re-install everything
docker compose up
```

Commands:

```bash
# Run all tests once

```

**Analyze command**

You can use the following tool to analyze the releasing bundle content:

```bash
npm install -g source-map-explorer # run this only once

source-map-explorer dist/index.js
```

## Storybook

To make the storybook site run:

```bash
npm run bootstrap # only needed first time and run at repo root level
npm run build-storybook # run at this package
npm run start -w packages/scene-composer
```

Optionally, if you want to pre-load AWS credentials from a local profile, you can set the `AWS_PROFILE` argument on the command line:

```bash
AWS_PROFILE=AppKit npm run start -w packages/scene-composer
```

If you want to have an AWS Scene pull live data from your TwinMaker workspace you can add a queryJson to the storybook arguments.  Because it's a JSON and not kept as part of the URL parameters the query will have to be reset if you refresh the page.  Below is an example query for a single TwinMaker property value.

```bash
[
  {
    "entityId": "f913470a-d011-45ca-ac84-3265f6327105",
    "componentName": "MetabolicCageOne",
    "properties": [{ "propertyName": "Temperature" }]
  }
]
'''

When using an query for live data the default data range is the last 5 minutes.  You can change this by setting the viewportDurationSecs fields to a custom value.  The field expects a number in seconds.  It does not currently support setting a fixed start and end date range for a viewport so  it work best when you have a way to regularly inject live sample date.

- [Storybook Intro](https://storybook.js.org/docs/react/get-started/introduction)

## Debugging
Scene composer is embedded with a custom logging system based on [debugjs](https://www.npmjs.com/package/debug). With this being a complex component with lots of potential things going on, this system allows you to filter logs based on more specific attributes, and ultimately reduces noise.

What you will notice is by default, there are very few messages in the browser console, this is because they are hidden by default from the end user, so you need to enable them in local storage. To do this, run this command in your browser console:

```javascript
localStorage.debug = '*'; // by default gives you all logging output
localStorage.debug = '*,-verbose:*'; // don't show verbose logging
localStorage.debug = 'ruleEvaluator*'; // only show messages related to the ruleEvaluator component
```
