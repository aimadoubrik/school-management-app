import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isMobile: false,
  },
  reducers: {
    toggleMobile: (state, action) => {
      state.isMobile = action.payload;
    },
  },
});

export const { toggleMobile } = uiSlice.actions;
export default uiSlice.reducer;
