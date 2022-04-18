import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoggedIn: false,
  },
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
    updateAccessKeyId(state, action) {
      state.user = {
        ...state.user,
        accessKeyId: action.payload,
      };
    },
  },
});

export const { login, logout, updateAccessKeyId } = authSlice.actions;
export default authSlice.reducer;
