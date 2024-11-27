<<<<<<< HEAD
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
      return response.data;
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

const stagiairesSlice = createSlice({
  name: 'stagiaires',
  initialState,
  reducers: {
    setFiliereFilter(state, action) {
      state.filiereFilter = action.payload;
    },
    setGroupeFilter(state, action) {
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
        state.error = action.payload;
      })
      .addCase(addStagiaireAPI.fulfilled, (state, action) => {
        state.stagiaires.push(action.payload);
      })
      .addCase(addStagiaireAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateStagiaireAPI.fulfilled, (state, action) => {
        const index = state.stagiaires.findIndex(
          (stagiaire) => stagiaire.id === action.payload.id
        );
        if (index !== -1) {
          state.stagiaires[index] = action.payload;
        }
      })
      .addCase(updateStagiaireAPI.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteStagiaireAPI.fulfilled, (state, action) => {
        state.stagiaires = state.stagiaires.filter(
          (stagiaire) => stagiaire.id !== action.payload
        );
      })
      .addCase(deleteStagiaireAPI.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setFiliereFilter, setGroupeFilter } = stagiairesSlice.actions;

export const selectStagiaires = (state) => state.stagiaires.stagiaires;
export const selectStatus = (state) => state.stagiaires.status;
export const selectError = (state) => state.stagiaires.error;

export default stagiairesSlice.reducer;
=======
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
// Async thunks using apiService
export const fetchStagiaires = createAsyncThunk('stagiaires/fetchStagiaires', async () => {
  return await apiService.get(STAGIAIRES_ENDPOINT);
});

export const addStagiaireAPI = createAsyncThunk('stagiaires/addStagiaireAPI', async (stagiaire) => {
  return await apiService.post(STAGIAIRES_ENDPOINT, stagiaire);
});

export const deleteStagiaireAPI = createAsyncThunk('stagiaires/deleteStagiaireAPI', async (cef) => {
  await apiService.delete(`${STAGIAIRES_ENDPOINT}/${cef}`);
  return cef;
});

export const updateStagiaireAPI = createAsyncThunk(
  'stagiaires/updateStagiaireAPI',
  async (stagiaire) => {
    return await apiService.put(`${STAGIAIRES_ENDPOINT}/${stagiaire.cef}`, stagiaire);
  }
);

// Redux slice
const stagiairesSlice = createSlice({
  name: 'stagiaires',
  initialState,
  reducers: {
    addStagiaire: (state, action) => {
      state.stagiaires.push(action.payload);
    },
    deleteStagiaire: (state, action) => {
      state.stagiaires = state.stagiaires.filter((stagiaire) => stagiaire.cef !== action.payload);
    },
    setFiliereFilter: (state, action) => {
      state.filiereFilter = action.payload;
    },
    setGroupeFilter: (state, action) => {
      state.groupeFilter = action.payload;
    },
    updateStagiaire: (state, action) => {
      const index = state.stagiaires.findIndex((stagiaire) => stagiaire.cef === action.payload.cef);
      if (index !== -1) {
        state.stagiaires[index] = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
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
        state.stagiaires.push(action.payload);
        state.error = null;
      })
      .addCase(addStagiaireAPI.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(deleteStagiaireAPI.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteStagiaireAPI.fulfilled, (state, action) => {
        state.stagiaires = state.stagiaires.filter((stagiaire) => stagiaire.cef !== action.payload);
        state.error = null;
      })
      .addCase(deleteStagiaireAPI.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(updateStagiaireAPI.pending, (state) => {
        state.error = null;
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
export default stagiaireSlice.reducer;
>>>>>>> 421311fd076b24647fd3806bd2555382970ebf29
