import config from './config';

export const authConfig = {
  api: {
    baseURL: config.api.baseUrl,
    endpoints: config.api.endpoints.auth,
  },
  tokens: config.tokens,
  settings: {
    passwordMinLength: config.security.password.minLength,
    passwordRequirements: config.security.password.requirements,
    loginAttempts: {
      max: config.security.rateLimit.loginAttempts.max,
      lockoutDuration: config.security.rateLimit.loginAttempts.lockoutDuration,
    },
  },
};

export default authConfig;
