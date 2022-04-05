import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    logoutIsOpen: false,
    zipDownloadIsOpen: false,
  },
  reducers: {
    logoutModal(state) {
      state.logoutIsOpen = !state.logoutIsOpen;
    },
    zipDownloadModal(state, action) {
      state.zipDownloadIsOpen = !state.zipDownloadIsOpen;
    }
  },
});

export const { logoutModal, zipDownloadModal } = modalSlice.actions;
export default modalSlice.reducer;