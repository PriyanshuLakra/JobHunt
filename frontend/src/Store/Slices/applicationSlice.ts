import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;


const applicationSlice = createSlice({
    name: "application",
    initialState: {
        applications: [],
        jobInfo: [],
        loading: false,
        error: null,
        message: null
    },
    reducers: {
        requestForAllApplications(state) {
            state.loading = true,
                state.error = null
        },
        successForAllApplications(state, action) {
            state.loading = false;
            state.error = null;
            const { applications, jobInfo } = action.payload;


            // Merge jobInfo into applications based on forWhichJobId
            state.applications = applications;
            state.jobInfo = jobInfo;
            state.message = action.payload.message
        },
        failureForAllApplications(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        requestForMyApplications(state) {
            state.loading = true,
                state.error = null
        },
        successForMyApplications(state, action) {
            state.loading = false;
            state.error = null;
            const { applicationApplied, jobs } = action.payload

            state.applications = applicationApplied
            state.jobInfo = jobs
        },
        failureForMyApplications(state, action) {
            state.loading = false,
                state.error = action.payload
        },
        requestForPostApplication(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        successForPostApplication(state, action) {
            state.loading = false;
            state.error = null;
            state.message = action.payload;
        },
        failureForPostApplication(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.message = null;
        },
        requestForDeleteApplication(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        successForDeleteApplication(state, action) {
            state.loading = false;
            state.error = null;
            state.message = action.payload;
        },
        failureForDeleteApplication(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.message = null;
        },
        clearAllErrors(state) {
            state.error = null;
            state.applications = state.applications;
        },
        resetApplicationSlice(state) {
            state.error = null;
            state.applications = state.applications;
            state.message = null;
            state.loading = false;
        },
    }
})

export const fetchEmployerApplications = () => async (dispatch: any) => {

    dispatch(applicationSlice.actions.requestForAllApplications());

    try {
        const response = await axios.get(`${apiUrl}/api/v1/application/employerGetAllApplication`,
            {
                withCredentials: true,
            })

        dispatch(
            applicationSlice.actions.successForAllApplications({
                applications: response.data?.applications || [], // Backend's `applications`
                jobInfo: response.data?.jobInfo || {}, // Backend's `jobInfo`
            })
        )
        dispatch(applicationSlice.actions.clearAllErrors());

    }
    catch (error: any) {
        dispatch(
            applicationSlice.actions.failureForAllApplications(
                error.response?.data?.message || "An unknown error occurred."
            )
        );
    }

}

export const fetchJobSeekerApplications = () => async (dispatch: any) => {
    dispatch(applicationSlice.actions.requestForMyApplications());
    try {
        const response = await axios.get(
            `${apiUrl}/api/v1/application/jobSeekerGetAllApplication`,
            {
                withCredentials: true,
            }
        );
        dispatch(
            applicationSlice.actions.successForMyApplications({
                jobs:response.data?.jobs || [],
                applicationApplied:response.data?.applicationApplied || {}
            })
        );
        dispatch(applicationSlice.actions.clearAllErrors());
    } catch (error: any) {
        dispatch(
            applicationSlice.actions.failureForMyApplications(
                error.response.data.message
            )
        );
    }
};

export const postApplication = (data: any, jobId: any) => async (dispatch: any) => {

    dispatch(applicationSlice.actions.requestForPostApplication());

    try {

        const response = await axios.post(`${apiUrl}/api/v1/application/PostApplication/${jobId}`,
            data,
            {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        dispatch(applicationSlice.actions.successForPostApplication(response.data.message));
        dispatch(applicationSlice.actions.clearAllErrors());

    } catch (error: any) {
        dispatch(
            applicationSlice.actions.failureForPostApplication(
                error.response.data.message
            )
        )
    }
}

export const deleteApplication = (id:any) => async (dispatch:any) => {
    dispatch(applicationSlice.actions.requestForDeleteApplication());
    try {
      const response = await axios.delete(
        `${apiUrl}/api/v1/application/deleteApplication/${id}`,
        { withCredentials: true }
      );
      dispatch(
        applicationSlice.actions.successForDeleteApplication(
          response.data.message
        )
      );
      dispatch(clearAllApplicationErrors());
    } catch (error:any) {
      dispatch(
        applicationSlice.actions.failureForDeleteApplication(
          error.response.data.message
        )
      );
    }
  };


export const clearAllApplicationErrors = () => (dispatch: any) => {
    dispatch(applicationSlice.actions.clearAllErrors());
};

export const resetApplicationSlice = () => (dispatch: any) => {
    dispatch(applicationSlice.actions.resetApplicationSlice());
};

export default applicationSlice.reducer;