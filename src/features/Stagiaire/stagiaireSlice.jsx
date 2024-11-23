import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Exemple d'état initial
const initialState = {
  stagiaires: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

// Action asynchrone pour récupérer les stagiaires depuis l'API
export const fetchStagiaires = createAsyncThunk('stagiaires/fetchStagiaires', async () => {
  const response = await fetch('http://localhost:3000/stagiaires');
  const data = await response.json();
  return data;
});

// Action asynchrone pour ajouter un stagiaire via l'API
export const addStagiaireAPI = createAsyncThunk('stagiaires/addStagiaireAPI', async (stagiaire) => {
  const response = await fetch('http://localhost:3000/stagiaires', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stagiaire),
  });
  const data = await response.json();
  return data;
});

// Action asynchrone pour supprimer un stagiaire via l'API
export const deleteStagiaireAPI = createAsyncThunk('stagiaires/deleteStagiaireAPI', async (cef) => {
  await fetch(`http://localhost:3000/stagiaires/${cef}`, {
    method: 'DELETE',
  });
  return cef; // Renvoi du cef pour la suppression dans le state
});

// Action asynchrone pour mettre à jour un stagiaire via l'API
export const updateStagiaireAPI = createAsyncThunk('stagiaires/updateStagiaireAPI', async (stagiaire) => {
  const response = await fetch(`http://localhost:3000/stagiaires/${stagiaire.cef}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stagiaire),
  });
  const data = await response.json();
  return data;
});

// Slice des stagiaires
const stagiaireSlice = createSlice({
  name: 'stagiaires',
  initialState,
  reducers: {
    // Ajouter un stagiaire localement dans le store (si besoin)
    addStagiaire: (state, action) => {
      state.stagiaires.push(action.payload);
    },
    // Supprimer un stagiaire localement dans le store
    deleteStagiaire: (state, action) => {
      state.stagiaires = state.stagiaires.filter(
        (stagiaire) => stagiaire.cef !== action.payload
      );
    },
    // Filtrage par filière
    setFiliereFilter: (state, action) => {
      state.filiereFilter = action.payload;
    },
    // Filtrage par groupe
    setGroupeFilter: (state, action) => {
      state.groupeFilter = action.payload;
    },
    // Mettre à jour un stagiaire localement dans le store
    updateStagiaire: (state, action) => {
      const index = state.stagiaires.findIndex(
        (stagiaire) => stagiaire.cef === action.payload.cef
      );
      if (index !== -1) {
        state.stagiaires[index] = action.payload;
      }
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

      // Ajouter un stagiaire via l'API
      .addCase(addStagiaireAPI.fulfilled, (state, action) => {
        state.stagiaires.push(action.payload); // Ajouter le stagiaire dans le store après ajout réussi
      })

      // Supprimer un stagiaire via l'API
      .addCase(deleteStagiaireAPI.fulfilled, (state, action) => {
        state.stagiaires = state.stagiaires.filter(
          (stagiaire) => stagiaire.cef !== action.payload // Supprimer le stagiaire du store après suppression réussie
        );
      })

      // Mettre à jour un stagiaire via l'API
      .addCase(updateStagiaireAPI.fulfilled, (state, action) => {
        const index = state.stagiaires.findIndex(
          (stagiaire) => stagiaire.cef === action.payload.cef
        );
        if (index !== -1) {
          state.stagiaires[index] = action.payload; // Mettre à jour le stagiaire dans le store
        }
      });
  },
});

export const {
  addStagiaire,
  deleteStagiaire,
  setFiliereFilter,
  setGroupeFilter,
  updateStagiaire,
} = stagiaireSlice.actions;

// Sélecteurs
export const selectStagiaires = (state) => state.stagiaires.stagiaires;
export const selectFiliereFilter = (state) => state.stagiaires.filiereFilter;
export const selectGroupeFilter = (state) => state.stagiaires.groupeFilter;

// Export du reducer
export default stagiaireSlice.reducer;
