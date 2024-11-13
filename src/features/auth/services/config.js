const config = {
  api: {
    version: 'v1',
    baseUrl: 'http://localhost:3003',
    timeout: 5000,
    endpoints: {
      auth: {
        login: {
          path: '/users',
          method: 'GET',
        },
        signup: {
          path: '/users',
          method: 'POST',
        },
        googleAuth: {
          path: '/auth/google',
          method: 'POST',
        },
        refreshToken: {
          path: '/auth/refresh-token',
          method: 'POST',
        },
        logout: {
          path: '/auth/logout',
          method: 'POST',
        },
      },
    },
  },
  tokens: {
    access: {
      expiresIn: '24h',
      algorithm: 'HS256',
    },
    refresh: {
      expiresIn: '7d',
      algorithm: 'HS256',
    },
  },
  security: {
    password: {
      minLength: 8,
      maxLength: 128,
      requirements: {
        uppercase: true,
        lowercase: true,
        numbers: true,
        specialCharacters: true,
      },
      blacklist: ['password', '123456', 'qwerty'],
    },
    rateLimit: {
      loginAttempts: {
        max: 5,
        windowMs: 900000, // 15 minutes
        lockoutDuration: '15m',
      },
      apiRequests: {
        windowMs: 900000,
        max: 100,
      },
    },
    session: {
      maxConcurrentSessions: 3,
      invalidateOnPasswordChange: true,
    },
  },
  roles: {
    student: {
      permissions: ['read:profile', 'update:profile'],
    },
    teacher: {
      permissions: ['read:profile', 'update:profile', 'read:students', 'create:assignments'],
    },
    admin: {
      permissions: ['*'],
    },
  },
};

export default config;
