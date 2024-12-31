import {configureStore }  from "@reduxjs/toolkit"
import jobReducers from "./Slices/jobSclice"

import userReducer from "./Slices/userSlice"
import applicationReducer from "./Slices/applicationSlice"

import updateProfileReducer from "./Slices/UpdateProfileSlice"

const store = configureStore({
    reducer:{
        user: userReducer,
        jobs:jobReducers,
        applications: applicationReducer,
        updateProfile: updateProfileReducer
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

