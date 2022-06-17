import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    logoutIsOpen: false,
    zipDownloadIsOpen: false,
    exportIsOpen: false,
    loadUpload: {
      end: false,
      success: true,
      message: '',
      data: null,
    },
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
    },
    setLoadUpload(state, { payload }) {
      state.loadUpload = {
        ...state.loadUpload,
        ...payload,
      };
    },
  },
});

export const { logoutModal, zipDownloadModal, exportModal, setLoadUpload } = modalSlice.actions;
export default modalSlice.reducer;
