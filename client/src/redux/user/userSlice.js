import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser : null,
  error  :null,
  loading : false
}

export const userSlice = createSlice({
  name:"user",
  initialState,
  reducers:{
    signInStart: (state) =>{
      state.loading = true;
      state.error = null
    },
    signInSuccess: (state,action)=>{
      state.currentUser = action.payload,
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state,action)=> {
        state.loading=false;
        state.error = action.payload;
    },
    updateStart:(state,)=> {
        state.loading=true,
        state.error=null
    },
    updateDone:(state,action)=>  {
      state.currentUser = action.payload,
      state.loading = false;
      state.error = null;
    },
    updateFailure:(state,action)=> {
        state.loading=false;
        state.error = action.payload;
    },
    deleteUserStart:(state,)=> {
      state.loading=true,
      state.error=null
    },
    deleteUserDone:(state,action)=>  {
    state.currentUser = null,
    state.loading = false;
    state.error = null;
    },
    deleteUserFailure:(state,action)=> {
      state.loading=false;
      state.error = action.payload;
    },
  }
} ) 

export const {signInStart, signInSuccess, signInFailure, updateStart, updateDone, updateFailure, deleteUserStart, deleteUserDone, deleteUserFailure } = userSlice.actions;

export  default userSlice.reducer;