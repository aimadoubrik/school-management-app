import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config, { apiService } from '../../../api/config';

// Constants
const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  LOGIN_ATTEMPTS: 'login_attempts',
};

const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;

const validatePassword = (password) => {
  const errors = [];
  if (!password || typeof password !== 'string') {
    errors.push('Password is required and must be a string');
    return errors;
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  return errors;
};

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return 'Email is required and must be a string';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

const getStorageItem = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || sessionStorage.getItem(key));
  } catch (error) {
    console.error(`Error retrieving ${key} from storage:`, error);
    return null;
  }
};

const setStorageItem = (key, value, storage = localStorage) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in storage:`, error);
  }
};

const isLockedOut = (email) => {
  try {
    const attempts = getStorageItem(`${STORAGE_KEYS.LOGIN_ATTEMPTS}-${email}`) || {
      count: 0,
      timestamp: null,
    };

    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
      const timePassed = Date.now() - attempts.timestamp;
      if (timePassed < LOCKOUT_DURATION) {
        return true;
      }
      localStorage.removeItem(`${STORAGE_KEYS.LOGIN_ATTEMPTS}-${email}`);
    }
    return false;
  } catch (error) {
    console.error('Error checking lockout status:', error);
    return false;
  }
};

const recordLoginAttempt = (email) => {
  try {
    const attempts = getStorageItem(`${STORAGE_KEYS.LOGIN_ATTEMPTS}-${email}`) || {
      count: 0,
      timestamp: null,
    };

    attempts.count += 1;
    attempts.timestamp = Date.now();
    setStorageItem(`${STORAGE_KEYS.LOGIN_ATTEMPTS}-${email}`, attempts);

    return attempts.count;
  } catch (error) {
    console.error('Error recording login attempt:', error);
    return 0;
  }
};

// Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const emailError = validateEmail(credentials.email);
      if (emailError) {
        throw new Error(emailError);
      }

      if (!credentials.password) {
        throw new Error('Password is required');
      }

      if (isLockedOut(credentials.email)) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - (Date.now() - getStorageItem(`${STORAGE_KEYS.LOGIN_ATTEMPTS}-${credentials.email}`).timestamp)) / 60000);
        throw new Error(`Account temporarily locked. Please try again in ${remainingTime} minutes.`);
      }

      const users = await apiService.get(`/users?email=${encodeURIComponent(credentials.email)}`);
      const user = users[0];
      console.log(user);

      if (!user) {
        // Use a generic error message to prevent user enumeration
        throw new Error('Invalid email or password');
      }

      if (user.password !== credentials.password) {
        const attempts = recordLoginAttempt(credentials.email);
        const remainingAttempts = MAX_LOGIN_ATTEMPTS - attempts;

        if (remainingAttempts > 0) {
          throw new Error(`Invalid email or password. ${remainingAttempts} attempts remaining.`);
        } else {
          throw new Error('Account temporarily locked. Please try again later.');
        }
      }

      // Generate tokens (in real app these would come from the server)
      const token = `dummy-token-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const refreshToken = `dummy-refresh-token-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      };

      setStorageItem(STORAGE_KEYS.TOKEN, token, storage);
      setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken, storage);
      setStorageItem(STORAGE_KEYS.USER, userData, storage);

      return {
        token,
        refreshToken,
        user: userData,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const emailError = validateEmail(userData.email);
      if (emailError) {
        throw new Error(emailError);
      }

      const passwordErrors = validatePassword(userData.password);
      if (passwordErrors.length > 0) {
        throw new Error(passwordErrors.join('. '));
      }

      // Check if user exists
      const existingUsers = await apiService.get(`/users?email=${encodeURIComponent(userData.email)}`);
      if (existingUsers.length > 0) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        ...userData,
        createdAt: new Date().toISOString(),
        status: 'active',
      };

      const response = await apiService.post('/users', newUser);

      // Generate tokens
      const token = `dummy-token-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const refreshToken = `dummy-refresh-token-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const userDataToStore = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
        photo: response.photo,
      };

      setStorageItem(STORAGE_KEYS.TOKEN, token);
      setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      setStorageItem(STORAGE_KEYS.USER, userDataToStore);

      return {
        token,
        refreshToken,
        user: userDataToStore,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

// Initial state
const initialState = {
  user: getStorageItem(STORAGE_KEYS.USER),
  token: localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN),
  isAuthenticated: !!(
    localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN)
  ),
  status: 'idle',
  error: null,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      try {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.USER);
      } catch (error) {
        console.error('Error during logout:', error);
      }

      return {
        ...initialState,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;