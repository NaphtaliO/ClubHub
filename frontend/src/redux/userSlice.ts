import { createSlice} from '@reduxjs/toolkit';
// import type { RootState } from '../redux/store';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: null,
    }, reducers: {
        logIn: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { logIn } = userSlice.actions;
// export const selectUser = (state: RootState) => state.user.value
export default userSlice.reducer;