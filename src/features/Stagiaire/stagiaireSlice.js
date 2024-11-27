import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const initialState = {
  stagiaires: [],
  status: 'idle', 
  error: null,
  filiereFilter: null,
  groupeFilter: null,  
};

export const fetchStagiaires = createAsyncThunk(
  'stagiaires/fetchStagiaires',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/stagiaires`);
      return response.data; // Return data if the request succeeds
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addStagiaireAPI = createAsyncThunk(
  'stagiaires/addStagiaireAPI',
  async (stagiaire, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/stagiaires`, stagiaire);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateStagiaireAPI = createAsyncThunk(
  'stagiaires/updateStagiaireAPI',
  async (stagiaire, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/stagiaires/${stagiaire.id}`, stagiaire);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deleteStagiaireAPI = createAsyncThunk(
  'stagiaires/deleteStagiaireAPI',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/stagiaires/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Redux slice
const stagiairesSlice = createSlice({
  name: 'stagiaires',
  initialState,
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
        state.error = action.payload || action.error.message;
      })
      .addCase(addStagiaireAPI.fulfilled, (state, action) => {
        state.stagiaires.push(action.payload); 
      })
      .addCase(updateStagiaireAPI.fulfilled, (state, action) => {
        const index = state.stagiaires.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.stagiaires[index] = action.payload; 
        }
      })
      .addCase(deleteStagiaireAPI.fulfilled, (state, action) => {
        state.stagiaires = state.stagiaires.filter((s) => s.id !== action.payload); 
      });
  },
});

export const { setFiliereFilter, setGroupeFilter } = stagiairesSlice.actions;
export const selectStagiaires = (state) => state.stagiaires.stagiaires;
export const selectStatus = (state) => state.stagiaires.status;
export const selectError = (state) => state.stagiaires.error;

export default stagiairesSlice.reducer;
