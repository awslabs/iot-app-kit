export const getEnvCredentials = () => {
  if (
    process.env.AWS_ACCESS_KEY_ID == null ||
    process.env.AWS_SECRET_ACCESS_KEY == null ||
    process.env.AWS_SESSION_TOKEN == null
  ) {
    throw new Error(
      'Missing credentials: must provide the following env variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_SESSION_TOKEN within .env'
    );
  }
  return {
    // Provided by `.env` environment variable file
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  };
};
