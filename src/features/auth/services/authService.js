import apiClient from './apiClient';
import authConfig from './authConfig';

class AuthService {
  constructor() {
    this.loginAttempts = new Map();
  }

  isLockedOut(email) {
    const attempts = this.loginAttempts.get(email) || { count: 0, timestamp: null };
    if (attempts.count >= authConfig.settings.loginAttempts.max) {
      const lockoutDuration =
        parseInt(authConfig.settings.loginAttempts.lockoutDuration) * 60 * 1000;
      const timePassed = Date.now() - attempts.timestamp;
      if (timePassed < lockoutDuration) {
        return true;
      }
      this.loginAttempts.delete(email);
    }
    return false;
  }

  recordLoginAttempt(email) {
    const attempts = this.loginAttempts.get(email) || { count: 0, timestamp: null };
    attempts.count += 1;
    attempts.timestamp = Date.now();
    this.loginAttempts.set(email, attempts);
  }

  async login(credentials) {
    try {
      if (this.isLockedOut(credentials.email)) {
        throw new Error('Account temporarily locked. Please try again later.');
      }

      // For json-server, we'll fetch the user by email
      const response = await apiClient.get(
        `${authConfig.api.endpoints.login.path}?email=${credentials.email}`
      );

      const users = response.data;
      const user = users.find((u) => u.email === credentials.email);

      if (!user) {
        throw new Error('User not found');
      }

      // In development, we'll do a simple password comparison
      if (user.password !== credentials.password) {
        throw new Error('Invalid password');
      }

      // Generate tokens (in development these are dummy tokens)
      const token = 'dummy-token-' + Date.now();
      const refreshToken = 'dummy-refresh-token-' + Date.now();

      // Store tokens based on remember me preference
      if (credentials.rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('user', JSON.stringify(user));
      }

      // Clear login attempts on successful login
      this.loginAttempts.delete(credentials.email);

      return {
        success: true,
        data: {
          token,
          refreshToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      };
    } catch (error) {
      if (error.response?.status === 401) {
        this.recordLoginAttempt(credentials.email);
      }

      throw {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed',
      };
    }
  }

  async signup(userData) {
    try {
      const passwordErrors = this.validatePassword(userData.password);
      if (passwordErrors.length > 0) {
        throw new Error(passwordErrors.join('. '));
      }

      // For json-server, we'll first check if user exists
      const existingUsers = await apiClient.get(
        `${authConfig.api.endpoints.signup.path}?email=${userData.email}`
      );

      if (existingUsers.data.length > 0) {
        throw new Error('User already exists');
      }

      // Create new user
      const response = await apiClient.post(authConfig.api.endpoints.signup.path, {
        ...userData,
        createdAt: new Date().toISOString(),
        status: 'active',
      });

      const token = 'dummy-token-' + Date.now();
      const refreshToken = 'dummy-refresh-token-' + Date.now();

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data));

      return {
        success: true,
        data: {
          token,
          refreshToken,
          user: response.data,
        },
      };
    } catch (error) {
      throw {
        success: false,
        error: error.response?.data?.error || error.message || 'Signup failed',
      };
    }
  }

  validatePassword(password) {
    const errors = [];
    const { passwordMinLength, passwordRequirements } = authConfig.settings;

    if (password.length < passwordMinLength) {
      errors.push(`Password must be at least ${passwordMinLength} characters long`);
    }
    if (passwordRequirements.uppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (passwordRequirements.lowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (passwordRequirements.numbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (passwordRequirements.specialCharacters && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return errors;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
