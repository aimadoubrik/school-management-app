import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../api/config';

// Helper for async thunks
const createApiThunk = (typePrefix, apiCall) => {
    return createAsyncThunk(typePrefix, async (args, { rejectWithValue }) => {
      try {
        return await apiCall(args);
      } catch (error) {
        return rejectWithValue(error.message);
      }
    });
  };

// Thunks
export const fetchModules = createApiThunk('modules/fetchModule', () => apiService.get('/modules'));

export const addModule = createApiThunk('modules/addModule', (moduleData) => apiService.post('/modules', filiereData));

export const editModule = createApiThunk('modules/editModule', (module) =>
  apiService.put(`/modules/${module.id}`, module)
);

export const deleteModule = createApiThunk('modules/deleteModule', async (id) => {
  await apiService.delete(`/modules/${id}`);
  return id;
});


// Helper for handling cases
const handleAsyncCases = (builder, thunk, operation, onSuccess) => {
    builder
      .addCase(thunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOperation = operation;
      })
      .addCase(thunk.fulfilled, (state, action) => {
        state.loading = false;
        onSuccess(state, action);
        state.currentOperation = null;
      })
      .addCase(thunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentOperation = null;
      });
  };


  const initialState = {
    modules: [],
    loading: false,
    error: null,
    currentOperation: null,
  };

  const modulesSlice = createSlice({
    name: 'modules',
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
      handleAsyncCases(builder, fetchModules, 'fetch', (state, action) => {
        state.modules = action.payload;
      });
  
      handleAsyncCases(builder, addModule, 'add', (state, action) => {
        state.modules.push(action.payload);
      });
  
      handleAsyncCases(builder, editModule, 'edit', (state, action) => {
        const index = state.modules.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.modules[index] = action.payload;
        }
      });
  
      handleAsyncCases(builder, deleteModule, 'delete', (state, action) => {
        state.modules = state.modules.filter((filiere) => filiere.id !== action.payload);
      });
    },
  });
  
  export const { clearError, setCurrentOperation } = modulesSlice.actions;
  export default modulesSlice.reducer;