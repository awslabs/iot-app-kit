# AWS IoT TwinMaker Development Tools

This package contains functionality for the AWS IoT TwinMaker Development Tools (TMDT), a set of tools to aid in [IoT TwinMaker]
(https://docs.aws.amazon.com/iot-twinmaker/latest/guide/what-is-twinmaker.html) project management. 


TMDT can snapshot an existing TwinMaker workspace (init), deploy this snapshot into any other existing workspace or automatically create a new workspace, S3bucket, and workspace role to deploy into (deploy), and easily delete all entities, component types, and scenes from a workspace (nuke).

You can follow [AWS IoT TwinMaker Getting Started](https://github.com/aws-samples/aws-iot-twinmaker-samples) to setup a sample TwinMaker workspace.


## Setting up TMDT

First clone the latest tip of this tool:

```
git clone https://github.com/awslabs/iot-app-kit.git --depth 1 && cd iot-app-kit/packages/tools-iottwinmaker
```

Navigate to the `tools-iottwinmaker` directory and install any node dependencies:

```
npm install
```
Build the package:
```
npm run build
```

This will build a node executable named `tmdt_local` on your machine. Run the following from the tmdt directory to verify if it was installed correctly.

```
./tmdt_local -h
```
If this command ran successfully without error, `tmdt` properly installed.

If you wish to install `tmdt` globally, first verify that you have permissions to globally install node packages and run:

```
npm run build-global
```

You should now be able to run the following from anywhere on your machine:
```
tmdt -h
```

___


## Bootstrap a TMDT project from an existing workspace

The following will initialize a tmdt project at the specified directory with a `tmdt.json` file

```
tmdt init --region [REGION] --workspace-id [WORKSPACE_ID] --out [PROJECT_DIRECTORY]
```
For example:
```
tmdt init --region us-east-1 --workspace-id CookieFactory0601 --out /tmp/testproj
```

___

## Deploy a tmdt project to another workspace

The following will deploy a tmdt project at the specified directory (the directory must contain a `tmdt.json` file) into the specified workspace.

```
tmdt deploy --region [REGION] --workspace-id [DESTINATION_WORKSPACE_ID] --dir [PROJECT_DIRECTORY]
```
For example:
```
tmdt deploy --region us-east-1 --workspace-id SyncB --dir /tmp/testproj
```

___

## Nuke a workspace

The following will delete all entities, component types, and scenes from a workspace so that the workspace can be deleted.

Warning: This command is destructive. Please take caution before running this command.

```
tmdt nuke --region [REGION] --workspace-id [WORKSPACE_TO_DELETE_RESOURCES_FOR]

```
For example:
```
tmdt nuke --region us-east-1 --workspace-id SyncB
```
___
## Uninstall
To uninstall the TMDT package globally, run:
```
npm uninstall -g tmdt
```
