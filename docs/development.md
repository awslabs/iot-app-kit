## Development Quick Start 

### Environment setup

Iot-App-Kit runs on node and uses yarn for package management. Specific versions are required in order to keep builds working with the current monorepo tooling.

- Node: any `v16` or higher
- Yarn: any `v1`, but not `v2` or higher

### Building Iot-App-Kit

With supported versions of node and yarn installed, you're ready to connect to SiteWise and start building for Iot-App-Kit. You'll need to pull in credentials, specify the SiteWise assets you'd like to connect to, build the project, and then run locally.

1. Copy a set of AWS JSON formatted credentials to the account with the access to the SiteWise resources you are requesting, at `<rootDir>/packages/components/creds.json`.

2. Alter the file `siteWiseQueries` within `@iot-app-kit/components` to point to valid SiteWise asset properties for the account credentials from the prior step.

3. `yarn bootstrap` installs dependencies and builds the Iot-App-Kit packages. Note: this is different than using `lerna bootstrap`, which installs dependencies but doesn't build the packages.

4. `yarn start` will run the project at `localhost:3333`. You should see example IoT App Kit components requesting data from SiteWise.