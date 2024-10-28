import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentUserData } from "@/types";

interface UserState {
    currentUserData: CurrentUserData | null; // Use null if no user is logged in initially
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: UserState = {
    currentUserData: null,
    accessToken: null,
    refreshToken: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUserData: (state, action: PayloadAction<CurrentUserData | null>) => {
            state.currentUserData = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setRefreshToken: (state, action: PayloadAction<string>) => {
            state.refreshToken = action.payload;
        },
        logout: (state) => {
            state.currentUserData = null;
        },
    },
});

// Export the action creators
export const { setCurrentUserData, setAccessToken, setRefreshToken, logout } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
