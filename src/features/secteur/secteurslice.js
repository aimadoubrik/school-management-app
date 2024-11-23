import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../api/config';

const createApiThunk = (typePrefix, apiCall) => {
  return createAsyncThunk(typePrefix, async (args, { rejectWithValue }) => {
    try {
      return await apiCall(args);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
};

export const fetchsecteurs = createApiThunk('secteurs/fetchsecteurs', () =>
  apiService.get('/secteurs')
);

export const addsecteur = createApiThunk('secteurs/addsecteur', (secteurData) =>
  apiService.post('/secteurs', secteurData)
);

export const editsecteur = createApiThunk('secteurs/editsecteur', (secteur) =>
  apiService.put(`/secteurs/${secteur.id}`, secteur)
);

export const deletesecteur = createApiThunk('secteurs/deletesecteur', async (id) => {
  await apiService.delete(`/secteurs/${id}`);
  return id;
});

const handleAsyncCases = (builder, thunk, operation, onSuccess) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.currentOperation = operation;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading = false;
      console.log(`${operation} succeeded:`, action.payload);
      onSuccess(state, action);
      state.currentOperation = null;
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currentOperation = null;
      console.error(`${operation} failed:`, action.payload);
    });
};

const initialState = {
  secteurs: [],
  loading: false,
  error: null,
  currentOperation: null,
};

const secteursSlice = createSlice({
  name: 'secteurs',
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
    handleAsyncCases(builder, fetchsecteurs, 'fetch', (state, action) => {
      state.secteurs = action.payload;
    });

    handleAsyncCases(builder, addsecteur, 'add', (state, action) => {
      state.secteurs.push(action.payload);
    });

    handleAsyncCases(builder, editsecteur, 'edit', (state, action) => {
      const index = state.secteurs.findIndex((f) => f.id === action.payload.id);
      if (index !== -1) {
        state.secteurs[index] = action.payload;
      }
    });

    handleAsyncCases(builder, deletesecteur, 'delete', (state, action) => {
      state.secteurs = state.secteurs.filter((secteur) => secteur.id !== action.payload);
    });
  },
});

export const { clearError, setCurrentOperation } = secteursSlice.actions;
export default secteursSlice.reducer;
