## Quick start for development

1. Environment setup

Ensure you have node version 16 and the latest version of yarn installed.


To do this, execute the following commands:
```
# Install `n`, a node package manager, globally to help switch between node versions.
npm i n -g

# Update to node version 16
sudo n 16

# Install the latest version of yarn
npm i yarn@latest -g

# Optionally, install lerna
npm i lerna -g
```

2. Build project

```
# Without installing lerna locally...
npx lerna bootstrap

# With lerna installed locally
lerna bootstrap
```

4. Provide credentials
   Copy a set of AWS JSON formatted credentials to the account with the access to the SiteWise resources you are requesting, at `<rootDir>/packages/components/creds.json`.

These credentials should not be uploaded to the repository.

5. Point to valid SiteWise resources

Alter the file `siteWiseQueries` within `@iot-app-kit/components` to point to valid SiteWise asset properties for the accounts credentials from the prior step.

6. Test locally
   run `yarn run start` at the project root, and then view `localhost:3333`. Here you should see example IoT App Kit components requesting data from SiteWise.


