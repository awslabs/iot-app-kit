import { IAM } from '@aws-sdk/client-iam';
import { STS } from '@aws-sdk/client-sts';
import { IoTTwinMaker } from '@aws-sdk/client-iottwinmaker';
import { S3 } from '@aws-sdk/client-s3';
import { CloudFormation } from '@aws-sdk/client-cloudformation';
import { KinesisVideo } from '@aws-sdk/client-kinesis-video';

// TODO cleanup pass
class AwsClients {
  region: string;
  sts: STS;
  tm: IoTTwinMaker;
  iam: IAM;
  s3: S3;
  cf: CloudFormation;
  kvs: KinesisVideo;

  constructor(region: string) {
    this.region = region;
    const options = { customUserAgent: 'tmdt/0.0.2', region: region };
    this.sts = new STS(options);
    this.tm = new IoTTwinMaker(options);
    this.iam = new IAM(options);
    this.s3 = new S3(options);
    this.cf = new CloudFormation(options);
    this.kvs = new KinesisVideo(options);
  }

  /**
   * Calls getCallerIdentity or throws an error if invalid
   * @returns Promise of the account ID and Arn
   */
  async getCurrentIdentity() {
    const identity = await this.sts.getCallerIdentity({});
    if (!identity.Account || !identity.Arn) {
      throw new Error('Invalid identity in the sts getCallerIdentity response');
    }
    return { accountId: identity.Account, accountArn: identity.Arn };
  }
}

let defaultAwsClients: AwsClients | null = null;

/**
 * Helper function that create new aws client with a given region
 * @param options object containing the aws region
 */
function initDefaultAwsClients(options: { region: string }) {
  defaultAwsClients = new AwsClients(options.region);
}

/**
 * getter function for the constructed aws client
 * @returns instance of aws client class
 */
function getDefaultAwsClients() {
  if (!defaultAwsClients) {
    throw new Error('initDefaultAwsClients must be called before calling getDefaultAwsClients');
  }
  return defaultAwsClients;
}

export { initDefaultAwsClients, getDefaultAwsClients, AwsClients };
