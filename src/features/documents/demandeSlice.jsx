import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  demandes: [],
  loading: false,
  error: null,
};

export const fetchDemandes = createAsyncThunk(
  'demandes/fetchDemandes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/demandes');
      if (!response.ok) {
        throw new Error('Failed to fetch demandes');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editDemande = createAsyncThunk(
  'demandes/editDemande',
  async (demande, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/demandes/${demande.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demande),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch demandes');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDemande = createAsyncThunk(
  'demandes/deleteDemande',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/demandes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch demandes');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const demandesSlice = createSlice({
  name: 'demandes',
  initialState,
  reducers: {
    editDemande: (state, action) => {
      const index = state.demandes.findIndex((demande) => demande.id === action.payload.id);
      if (index !== -1) {
        state.demandes[index] = action.payload;
      }
    },
    deleteDemande: (state, action) => {
      const index = state.demandes.findIndex((demande) => demande.id === action.payload);
      if (index !== -1) {
        state.demandes.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDemandes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDemandes.fulfilled, (state, action) => {
        state.loading = false;
        state.demandes = action.payload;
      })
      .addCase(fetchDemandes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editDemande.fulfilled, (state, action) => {
        const index = state.demandes.findIndex((demande) => demande.id === action.payload.id);
        if (index !== -1) {
          state.demandes[index] = action.payload;
        }
      })
      .addCase(deleteDemande.fulfilled, (state, action) => {
        const index = state.demandes.findIndex((demande) => demande.id === action.payload);
        if (index !== -1) {
          state.demandes.splice(index, 1);
        }
      });
  },
});

export default demandesSlice.reducer;
