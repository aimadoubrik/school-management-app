import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchStagiaires = createAsyncThunk(
  'stagiaires/fetchStagiaires',
  async () => {
    const response = await axios.get(`${BASE_URL}/stagiaires`);
    return response.data;
  }
);

export const addStagiaireAPI = createAsyncThunk(
  'stagiaires/addStagiaireAPI',
  async (stagiaire) => {
    const response = await axios.post(`${BASE_URL}/stagiaires`, stagiaire);
    return response.data;
  }
);

export const updateStagiaireAPI = createAsyncThunk(
  'stagiaires/updateStagiaireAPI',
  async (stagiaire) => {
    const response = await axios.put(`${BASE_URL}/stagiaires/${stagiaire.id}`, stagiaire);
    return response.data;
  }
);

export const deleteStagiaireAPI = createAsyncThunk(
  'stagiaires/deleteStagiaireAPI',
  async (id) => {
    await axios.delete(`${BASE_URL}/stagiaires/${id}`);
    return id;
  }
);

const stagiaireSlice = createSlice({
  name: 'stagiaires',
  initialState: {
    stagiaires: [],
    status: 'idle',
    error: null,
    filiereFilter: '',
    groupeFilter: '',
  },
  reducers: {
    setFiliereFilter: (state, action) => {
      state.filiereFilter = action.payload;
    },
    setGroupeFilter: (state, action) => {
      state.groupeFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStagiaires.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStagiaires.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stagiaires = action.payload;
      })
      .addCase(fetchStagiaires.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addStagiaireAPI.fulfilled, (state, action) => {
        state.stagiaires.push(action.payload);
      })
      .addCase(updateStagiaireAPI.fulfilled, (state, action) => {
        const index = state.stagiaires.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.stagiaires[index] = action.payload;
        }
      })
      .addCase(deleteStagiaireAPI.fulfilled, (state, action) => {
        state.stagiaires = state.stagiaires.filter(s => s.id !== action.payload);
      });
  },
});

export const { setFiliereFilter, setGroupeFilter } = stagiaireSlice.actions;

export const selectStagiaires = (state) => state.stagiaires.stagiaires;
export const selectStatus = (state) => state.stagiaires.status;
export const selectError = (state) => state.stagiaires.error;

export default stagiaireSlice.reducer;

