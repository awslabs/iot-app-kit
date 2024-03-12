# AWS IoT TwinMaker Development Tools

This package contains functionality for the AWS IoT TwinMaker Development Tools (TMDT), a set of tools to aid in [IoT TwinMaker](https://docs.aws.amazon.com/iot-twinmaker/latest/guide/what-is-twinmaker.html) project management. 

You can follow [AWS IoT TwinMaker Getting Started](https://github.com/aws-samples/aws-iot-twinmaker-samples) to setup a sample TwinMaker workspace.


TMDT has 3 core commands:
1. TMDT init - create a TMDT snapshot an existing TwinMaker workspace into a specifified directory
2. TMDT deploy - deploy a TMDT snapshot into any other existing workspace or automatically create a new workspace, S3bucket, and workspace role to deploy into
3. TMDT destroy - delete all entities, component types, and scenes from a workspace, with additional flags for deleting workspace s3 bucket + contents, and TwinMaker workspace

*(See below for a more detailed description of the commands)*


## Setting up TMDT using NPM

First verify that you have permissions to globally install node packages and run the following to use TMDT globally:

```
npm i -g @iot-app-kit/tools-iottwinmaker@alpha
```

You should now be able to run the following from anywhere on your machine:
```
tmdt -h
```
## Setting up TMDT using GitHub (Development)
First clone the latest tip of this tool:
```
git clone https://github.com/awslabs/iot-app-kit.git --depth 1 && cd iot-app-kit
```

Install any node dependencies and navigate to the `tools-iottwinmaker` directory:
```
npm install && cd packages/tools-iottwinmaker
```

Build the package:
```
npm run build
```

This will build a node executable named `tmdt_local` on your machine. Run the following from the tmdt directory to verify if it was installed correctly.
```
./tmdt_local -h
```

If this command ran successfully without error, `tmdt` properly installed locally. You can now `./tmdt_local [command] [parameters]` to run any of the 3 commands below.
___


## TMDT Init

### Init Parameters (required)
- *--region*: Specify the AWS region of the Workspace to bootstrap the project from
- *--workspace-id*: Specify the ID of the Workspace to bootstrap the project from
- *--out*: Specify the directory to initialize a project in

### Init Parameters (optional flags)
- *--endpoint-url*: Specify the TM service endpoint url

Use this command to bootstrap a TMDT project from an existing workspace.

The following will initialize a tmdt project at the specified directory with a `tmdt.json` file

```
tmdt init --region [REGION] --workspace-id [WORKSPACE_ID] --out [PROJECT_DIRECTORY]
```
For example:
```
tmdt init --region us-east-1 --workspace-id YourWorkspace --out /tmp/YourWorkspaceTMDT
```

___

## TMDT Deploy

### Deploy Parameters (required)
- *--region*: Specify the AWS region to deploy to
- *--workspace-id*: Specify the ID of the Workspace to deploy to
- *--dir*: Specify the project location, directory for tmdt.json file

### Deploy Parameters (optional flags)
- *--endpoint-url*: Specify the TM service endpoint url
- *--execution-role*: Specify the name of the execution role to associate with a new workspace

The following will deploy a tmdt project at the specified directory (the directory must contain a `tmdt.json` file) into the specified workspace.

```
tmdt deploy --region [REGION] --workspace-id [DESTINATION_WORKSPACE_ID] --dir [PROJECT_DIRECTORY]
```
For example:
```
tmdt deploy --region us-east-1 --workspace-id YourSecondWorkspace --dir /tmp/YourWorkspaceTMDT
```

**Note:** --workspace-id can either be an existing TwinMaker workspace, or you may enter a new ID for TMDT to automatically create your workspace (you will be prompted for confirmation). Take notice that the s3 bucket, IAM role, and dashboard role and policy is the default TwinMaker configurations generated as in the console. You may need to edit the created role/policy based on your specific use cases.

___

## TMDT Destroy

TMDT destroy is a destructive command hence it is a "Dry Run" by default command, meaning that all resources displayed during execution are not deleted, unless explicitly provided the "--nonDryRun" flag.

### Destroy Parameters (required)
- *--region*: Specify the AWS region of the workspace to delete
- *--workspace-id*: Specify the ID of the Workspace to delete from

### Destroy Parameters (optional flags)
- *--delete-workspace*: Specify if TM workspace should also be deleted
- *--delete-s3-bucket*: Specify if workspace s3 Bucket, its contents, and any associated logging bucket should be deleted
- *--nonDryRun*: Use this flag for real deletion of resources
- *--endpoint-url*: Specify the TM service endpoint url

**Example 1:**

The following will dry run display deletetion of all entities, component types, and scenes from a workspace. By default (no optional flags below selected), this will not actually delete any resources displayed, and it will not display workspace s3 bucket content deletion or the TwinMaker workspace itself.

```
tmdt destroy --region us-east-1 --workspace-id YourSecondWorkspace
```

**Example 2:**

The following will delete all entities, component types, scenes, workspace s3 bucket, and TwinMaker workspace itself.

**Warning:** This command is destructive. Please take caution before running this command.
```
tmdt destroy --region us-east-1 --workspace-id YourSecondWorkspace --delete-workspace --delete-s3-bucket --nonDryRun
```
**Additional notes:** 
1. *--delete-s3-bucket* implies *--delete-workspace*; you will not be able to delete a workspace s3 bucket without deleting the workspace itself (however you may delete the workspace without deleting the s3 bucket)
2. You may run TMDT destroy without --delete-workspace flag multiple times on the same workspace-id to keep deleting entities, component types, and scenes during development. However once the TwinMaker workspace itself has been deleted, you may no longer run destroy to delete any remaining resources such as s3 buckets. You must delete them manually in AWS console if this is the case.
___
## Uninstall
To uninstall the TMDT package globally, run:
```
npm uninstall -g tmdt
```
