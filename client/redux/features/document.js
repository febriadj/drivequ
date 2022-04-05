import { createSlice } from '@reduxjs/toolkit';

const documentSlice = createSlice({
  name: 'document',
  initialState: {
    size: 0,
  },
  reducers: {
    totalSize(state, action) {
      state.size = action.payload;
    },
  },
});

export const { totalSize } = documentSlice.actions;
export default documentSlice.reducer;
