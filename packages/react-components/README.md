**UI Tests**

Pre-requisites: You need to have [Docker](https://docs.docker.com/get-docker/) installed locally to run UI Tests, we rely on it to provide the necessary browsers to generate consistent screenshots.

Commands:

```bash
# Run all tests once
npm run test:ui

# Check for flaky tests
npm run test:ui:reliability

# Update snapshots
npm run test:ui:update
```

If you want to run the tests locally for whatever reason, as opposed to the docker image, you can run
the same commands with the `--production` flag, which will run them without docker:

```bash
# Run all tests once
npm run test:ui --production

# Check for flaky tests
npm run test:ui:reliability --production
```