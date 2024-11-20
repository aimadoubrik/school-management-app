import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formateurs: [], 
  selectedSecteur: '', 
  showTableauService: {}, 
  showModal: null, 
};

const formateurSlice = createSlice({
  name: 'formateurs', 
  initialState, 
  reducers: {
    setFormateurs: (state, action) => {
      state.formateurs = action.payload; 
    },
    setSelectedSecteur: (state, action) => {
      state.selectedSecteur = action.payload; 
    },
    toggleTableauService: (state, action) => {
      const id = action.payload;
      if (state.showTableauService[id]) {
        delete state.showTableauService[id];
      } else {
        state.showTableauService[id] = true; 
      }
    },
    toggleModal: (state, action) => {
      const id = action.payload;
      state.showModal = state.showModal === id ? null : id; 
    },
  },
});

export const { setFormateurs, setSelectedSecteur, toggleTableauService, toggleModal } = formateurSlice.actions;
export default formateurSlice.reducer;
