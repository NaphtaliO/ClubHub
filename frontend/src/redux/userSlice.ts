import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { State } from '../types/types';

const initialState: State = {
    value: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logIn: (state, action) => {
            state.value = action.payload;
        },
        logOut: (state) => {
            state.value = null;
        },
    }
})

export const { logIn, logOut } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.value;
export default userSlice.reducer;