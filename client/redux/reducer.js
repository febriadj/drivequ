import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isLoggedIn: false,
};

const reducers = createReducer(initialState, (builder) => {
  builder
    .addCase(createAction('isLoggedIn'), (state, action) => {
      state.isLoggedIn = action.payload;
    });
});

export default reducers;
