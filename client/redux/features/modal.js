import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    logoutIsOpen: false,
  },
  reducers: {
    logoutModal(state) {
      state.logoutIsOpen = !state.logoutIsOpen;
    },
  },
});

export const { logoutModal } = modalSlice.actions;
export default modalSlice.reducer;