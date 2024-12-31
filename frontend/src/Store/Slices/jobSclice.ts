import { createSlice } from "@reduxjs/toolkit";


import axios from "axios";


const apiUrl = import.meta.env.VITE_API_URL;

const jobSlice = createSlice({
    name:"jobs",
    initialState:{
        jobs:[],
        loading:false,
        error:null,
        message:null,
        singleJob:{},
        myJobs:[],
    },
    reducers:{
        requestForAllJobs(state) {
            state.loading = true;
            state.error = null;
          },
        successForAllJobs(state, action) {
            state.loading = false;
            state.jobs = action.payload;
            state.error = null;
          },
        failureForAllJobs(state, action) {
            state.loading = false;
            state.error = action.payload;
          },
          clearAllErrors(state) {
            state.error = null;
            state.jobs = state.jobs;
          },
          resetJobSlice(state) {
            state.error = null;
            state.jobs = state.jobs;
            state.loading = false;
            state.message = null;
            state.myJobs = state.myJobs;
            state.singleJob = {};
          },
          requestForSingleJob(state) {
            state.message = null;
            state.error = null;
            state.loading = true;
          },
          successForSingleJob(state, action) {
            state.loading = false;
            state.error = null;
            state.singleJob = action.payload;
          },
          failureForSingleJob(state, action) {
            state.singleJob = state.singleJob;
            state.error = action.payload;
            state.loading = false;
          },
          requestForPostJob(state) {
            state.message = null;
            state.error = null;
            state.loading = true;
          },
          successForPostJob(state, action) {
            state.message = action.payload;
            state.error = null;
            state.loading = false;
          },
          failureForPostJob(state, action) {
            state.message = null;
            state.error = action.payload;
            state.loading = false;
          },
      
          requestForDeleteJob(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
          },
          successForDeleteJob(state, action) {
            state.loading = false;
            state.error = null;
            state.message = action.payload;
          },
          failureForDeleteJob(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.message = null;
          },
          requestForMyJobs(state) {
            state.loading = true;
            state.myJobs = [];
            state.error = null;
          },
          successForMyJobs(state, action) {
            state.loading = false;
            state.myJobs = action.payload;
            state.error = null;
          },
          failureForMyJobs(state, action) {
            state.loading = false;
            state.myJobs = state.myJobs;
            state.error = action.payload;
          },
          
    }
})

export const fetchJobs = (city:string , niche:string , searchKeyword="") =>async (dispatch:any) =>{

    try{
        dispatch(jobSlice.actions.requestForAllJobs());
        let link = `${apiUrl}/api/v1/job/getall?`
        
        let queryparams = [];

        if(searchKeyword){
            queryparams.push(`searchKeyword=${searchKeyword}`)
        }
        if(city){
            queryparams.push(`city=${city}`)
        }
        if(niche){
            queryparams.push(`niche=${niche}`)
        }

        link+=queryparams.join("&");
        
        const response = await axios.get(link , {withCredentials:true});
        
        dispatch(jobSlice.actions.successForAllJobs(response.data.jobs));
        dispatch(jobSlice.actions.clearAllErrors());

    }
    catch(error:any){
        dispatch(jobSlice.actions.failureForAllJobs(error.response.data.message))
    }

}
export const fetchSingleJob = (jobId:any) => async (dispatch:any) => {
    dispatch(jobSlice.actions.requestForSingleJob());
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/job/get/${jobId}`,
        { withCredentials: true }
      );
      dispatch(jobSlice.actions.successForSingleJob(response.data.job));
      dispatch(jobSlice.actions.clearAllErrors());
    } catch (error:any) {
      dispatch(jobSlice.actions.failureForSingleJob(error.response.data.message));
    }
  };


export const clearAllJobErrors = () =>(dispatch:any)=>{

    dispatch(jobSlice.actions.clearAllErrors());
}

export const resetJobSlice = () =>(dispatch:any)=>{
    dispatch(jobSlice.actions.resetJobSlice())
}



export const postJob = (data:any) => async (dispatch:any) => {
  dispatch(jobSlice.actions.requestForPostJob());
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/job/postjob`,
      data,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(jobSlice.actions.successForPostJob(response.data.message));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error:any) {
    dispatch(jobSlice.actions.failureForPostJob(error.response.data.message));
  }
};



export const getMyJobs = () => async (dispatch:any) => {
  dispatch(jobSlice.actions.requestForMyJobs());
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/job/getmyjobs`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successForMyJobs(response.data.myJobs));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error:any) {
    dispatch(jobSlice.actions.failureForMyJobs(error.response.data.message));
  }
};

export const deleteJob = (id:any) => async (dispatch:any) => {
  dispatch(jobSlice.actions.requestForDeleteJob());
  try {
    const response = await axios.delete(
      `${apiUrl}/api/v1/job/delete/${id}`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successForDeleteJob(response.data.message));
    dispatch(clearAllJobErrors());
  } catch (error:any) {
    dispatch(jobSlice.actions.failureForDeleteJob(error.response.data.message));
  }
};




export default jobSlice.reducer

