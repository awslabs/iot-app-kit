export const getEnvCredentials = () => {
  if (
    import.meta.env.VITE_AWS_ACCESS_KEY_ID == null ||
    import.meta.env.VITE_AWS_SECRET_ACCESS_KEY == null
  ) {
    throw new Error(
      'Missing credentials: must provide the following env variables: VITE_AWS_ACCESS_KEY_ID, VITE_AWS_SECRET_ACCESS_KEY within .env.local'
    );
  }
  return {
    // Provided by `.env.local` environment variable file
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
  };
};
