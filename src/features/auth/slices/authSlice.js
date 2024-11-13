import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

// Thunk for login
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    console.log(response.data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Thunk for signup
export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const user = await authService.signup(userData);
    return user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Thunk for Google authentication
export const googleAuth = createAsyncThunk(
  'auth/googleAuth',
  async (googleToken, { rejectWithValue }) => {
    try {
      const response = await authService.googleAuth(googleToken);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state with persisted token check
const initialState = {
  user: {
    id: null,
    email: null,
    name: null,
    role: null,
  },
  token: authService.getToken(),
  isAuthenticated: !!authService.getToken(),
  status: 'idle',
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login
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
      // Handle signup
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle Google auth
      .addCase(googleAuth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
