import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    logoutIsOpen: false,
    zipDownloadIsOpen: false,
    exportIsOpen: false,
  },
  reducers: {
    logoutModal(state) {
      state.logoutIsOpen = !state.logoutIsOpen;
    },
    zipDownloadModal(state) {
      state.zipDownloadIsOpen = !state.zipDownloadIsOpen;
    },
    exportModal(state) {
      state.exportIsOpen = !state.exportIsOpen;
    }
  },
});

export const { logoutModal, zipDownloadModal, exportModal } = modalSlice.actions;
export default modalSlice.reducer;
