export function isDevelopmentEnv(): boolean {
  return process.env.NODE_ENV === 'development';
}
