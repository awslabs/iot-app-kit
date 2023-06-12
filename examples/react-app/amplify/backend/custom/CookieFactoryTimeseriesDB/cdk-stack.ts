import * as cdk from 'aws-cdk-lib';
import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper';
import * as timestream from 'aws-cdk-lib/aws-timestream';
import { Construct } from 'constructs';

export class cdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps, amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, 'env', {
      type: 'String',
      description: 'Current Amplify CLI env name',
    });
    /* AWS CDK code goes here - learn more: https://docs.aws.amazon.com/cdk/latest/guide/home.html */

    const { envName, projectName } = AmplifyHelpers.getProjectInfo();

    const cfnDatabase = new timestream.CfnDatabase(this, `timestream-db-${envName}-${projectName}`, /* all optional props */ {
      databaseName: `CookieFactoryTelemetry-${envName}-${projectName}`
    });

    new cdk.CfnOutput(this, 'TimestreamDB', {
      value: cfnDatabase.databaseName,
    });

    const cfnTable = new timestream.CfnTable(this, `timestream-db-table-${envName}-${projectName}-Telemetry`, /* all optional props */ {
      databaseName: cfnDatabase.databaseName,
      tableName: 'Telemetry',
    });

    cfnTable.node.addDependency(cfnDatabase);

    new cdk.CfnOutput(this, 'TimestreamTable', {
      value: cfnTable.tableName,
    });
  }
}
