import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/user';

const store = configureStore({
  reducer: {
    auth: userSlice,
  },
});

export default store;
