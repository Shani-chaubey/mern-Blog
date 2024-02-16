import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme:'light'
}

export const userSlice = createSlice({
    name:"theme",
    initialState,
    reducers:{
        toggleTheme: (state) =>{ state.theme = state.theme === 'light' ? 'dark' : 'light'} 
    }
})

export const { toggleTheme } = userSlice.actions;

export default  userSlice.reducer;