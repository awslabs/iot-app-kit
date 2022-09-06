## Development Quick Start 

### Environment setup

Iot-App-Kit runs on node and uses npm for package management. Specific versions are required in order to keep builds working with the current monorepo tooling.

Ensure you have `node` version 16 and `npm` > 8.0.

- Node: any `v16` or higher
- Npm: `v8.0.0` or higher

### Building Iot-App-Kit

With supported versions of node and npm installed, you're ready to connect to SiteWise and start building for Iot-App-Kit. You'll need to pull in credentials, specify the SiteWise assets you'd like to connect to, build the project, and then run locally.

1. Copy a set of AWS JSON formatted credentials to the account with the access to the SiteWise resources you are requesting, at `<rootDir>/packages/components/creds.json`.

2. Alter the file `siteWiseQueries` within `@iot-app-kit/components` to point to valid SiteWise asset properties for the account credentials from the prior step.

# Update to node version 16
sudo n 16
```

2. Build project

```bash
cd iot-app-kit/ (root)
npm install
npm run build
```

3. Running build commands for specific packages

```
npm run <command> -w @iot-app-kit/<package>
```

4. Provide credentials
   Copy a set of AWS JSON formatted credentials to the account with the access to the SiteWise resources you are requesting, at `<rootDir>/packages/components/creds.json`.

These credentials should not be uploaded to the repository.

5. Point to valid SiteWise resources

Alter the file `siteWiseQueries` within `@iot-app-kit/components` to point to valid SiteWise asset properties for the accounts credentials from the prior step.

6. Test locally

Run`npm run start` at the project root and then view `localhost:3333`. You should see example IoT App Kit components requesting data from SiteWise.

### Coding guidelines and requirements

Utilize the [coding guidelines](https://github.com/awslabs/iot-app-kit/tree/main/docs/CodingGuidelines.md) for the requirements in creating IoT App Kit components, and general coding best practices for this repository.
