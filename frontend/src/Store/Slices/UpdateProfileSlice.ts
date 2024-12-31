import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const apiUrl = import.meta.env.VITE_API_URL;

const updateProfileSlice = createSlice({
  name: "updateProfile",
  initialState: {
    loading: false,
    error: null,
    isUpdated: false,
  },
  reducers: {
    updateProfileRequest(state) {
      state.loading = true;
    },
    updateProfileSuccess(state) {
      state.error = null;
      state.loading = false;
      state.isUpdated = true;
    },
    updateProfileFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.isUpdated = false;
    },
    updatePasswordRequest(state) {
      state.loading = true;
    },
    updatePasswordSuccess(state) {
      state.error = null;
      state.loading = false;
      state.isUpdated = true;
    },
    updatePasswordFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.isUpdated = false;
    },
    profileResetAfterUpdate(state) {
      state.error = null;
      state.isUpdated = false;
      state.loading = false;
    },
  },
});

export const updateProfile = (data:any) => async (dispatch:any) => {
  dispatch(updateProfileSlice.actions.updateProfileRequest());
  try {
    console.log(data)
    await axios.put(
      `${apiUrl}/api/v1/user/updateProfile`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(updateProfileSlice.actions.updateProfileSuccess());
  } catch (error:any) {
    dispatch(
      updateProfileSlice.actions.updateProfileFailed(
        error.response.data.message || "Failed to update profile."
      )
    );
  }
};
export const updatePassword = (data:any) => async (dispatch:any) => {
  dispatch(updateProfileSlice.actions.updatePasswordRequest());
  try {
    await axios.put(
      `${apiUrl}/api/v1/user/updatePassword`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(updateProfileSlice.actions.updatePasswordSuccess());
  } catch (error:any) {
    dispatch(
      updateProfileSlice.actions.updatePasswordFailed(
        error.response.data.message || "Failed to update password."
      )
    );
  }
};

export const clearAllUpdateProfileErrors = () => (dispatch:any) => {
  dispatch(updateProfileSlice.actions.profileResetAfterUpdate());
};

export default updateProfileSlice.reducer;