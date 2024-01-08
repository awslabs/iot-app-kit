interface Credentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string | undefined;
}

/** Call to return AWS SDK credentials defined in `.env`.  */
export function getEnvCredentials(): Credentials | never {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN;

  if (!accessKeyId) {
    throw new Error(
      'Missing credentials: AWS_ACCESS_KEY_ID. Update AWS_ACCESS_KEY_ID in root `.env` file.'
    );
  }

  if (!secretAccessKey) {
    throw new Error(
      'Missing credentials: AWS_SECRET_ACCESS_KEY. Update AWS_SECRET_ACCESS_KEY in root `.env` file.'
    );
  }

  return {
    // Provided by `.env` environment variable file
    accessKeyId,
    secretAccessKey,
    sessionToken,
  };
}
