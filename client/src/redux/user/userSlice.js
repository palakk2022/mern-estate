import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // User sign-in reducers
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInfailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetError: (state) => {
      state.error = null;
    },

    // User update reducers
    updateUserStart: (state) => {
      state.loading = true; // Indicate that the update process is in progress
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload; // Update the current user with new data
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload; // Save the error message
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInfailure,
  resetError,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
