import { createSlice} from '@reduxjs/toolkit';
// import type { RootState } from '../redux/store';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: null,
    }, reducers: {
        logIn: (state, action) => {
            state.value = action.payload;
        },
        logOut: (state) => {
            state.value = null;
        },
    }
})

export const { logIn, logOut } = userSlice.actions;
// export const selectUser = (state: RootState) => state.user.value
export default userSlice.reducer;