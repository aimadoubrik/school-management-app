// src/features/filieres/filieresSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import filiereService from './filiereService';
import { handleApiError } from '../../api/config';

// Fetch all filieres
export const fetchFilieres = createAsyncThunk(
  'filieres/fetchFilieres',
  async (_, { rejectWithValue }) => {
    try {
      return await filiereService.getFilieres();
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Add new filiere
export const addFiliere = createAsyncThunk(
  'filieres/addFiliere',
  async (filiereData, { rejectWithValue }) => {
    try {
      return await filiereService.addFiliere(filiereData);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Edit filiere
export const editFiliere = createAsyncThunk(
  'filieres/editFiliere',
  async (filiere, { rejectWithValue }) => {
    try {
      return await filiereService.updateFiliere(filiere);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Delete filiere
export const deleteFiliere = createAsyncThunk(
  'filieres/deleteFiliere',
  async (id, { rejectWithValue }) => {
    try {
      return await filiereService.deleteFiliere(id);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const initialState = {
  filieres: [],
  loading: false,
  error: null,
  currentOperation: null,
};

const filieresSlice = createSlice({
  name: 'filieres',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOperation: (state, action) => {
      state.currentOperation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch filieres
      .addCase(fetchFilieres.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOperation = 'fetch';
      })
      .addCase(fetchFilieres.fulfilled, (state, action) => {
        state.loading = false;
        state.filieres = action.payload;
        state.currentOperation = null;
      })
      .addCase(fetchFilieres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.currentOperation = null;
      })

      // Add filiere
      .addCase(addFiliere.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOperation = 'add';
      })
      .addCase(addFiliere.fulfilled, (state, action) => {
        state.loading = false;
        state.filieres.push(action.payload);
        state.currentOperation = null;
      })
      .addCase(addFiliere.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.currentOperation = null;
      })

      // Edit filiere
      .addCase(editFiliere.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOperation = 'edit';
      })
      .addCase(editFiliere.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.filieres.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.filieres[index] = action.payload;
        }
        state.currentOperation = null;
      })
      .addCase(editFiliere.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.currentOperation = null;
      })

      // Delete filiere
      .addCase(deleteFiliere.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOperation = 'delete';
      })
      .addCase(deleteFiliere.fulfilled, (state, action) => {
        state.loading = false;
        state.filieres = state.filieres.filter((filiere) => filiere.id !== action.payload);
        state.currentOperation = null;
      })
      .addCase(deleteFiliere.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.currentOperation = null;
      });
  },
});

export const { clearError, setCurrentOperation } = filieresSlice.actions;
export default filieresSlice.reducer;
