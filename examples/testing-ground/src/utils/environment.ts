/**
 * Validates that the process environment has the expected values. Returns an
 * object containing all the values with the 'REACT_APP_' prefix removed.
 */
function validateEnvironment() {
  if (
    !process.env.REACT_APP_AWS_ACCESS_KEY_ID ||
    !process.env.REACT_APP_AWS_SECRET_ACCESS_KEY ||
    !process.env.REACT_APP_AWS_SESSION_TOKEN
  ) {
    throw new Error('Environment variables not set up. Please add the values described in .env.example.');
  }

  return {
    AWS_ACCESS_KEY_ID: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    AWS_SESSION_TOKEN: process.env.REACT_APP_AWS_SESSION_TOKEN,
  };
}

/**
 * Object containing the validated environment variables.
 */
export const environment = validateEnvironment();
