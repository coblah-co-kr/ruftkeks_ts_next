import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface TokenState {
    token : string;
}

const initialState: TokenState = {
    token : '',
};

const accessTokenUpdate = createSlice({
    name: "accessToken",
    initialState,
    reducers: {
        updateAccessToken: (
            state: TokenState,
            action: PayloadAction<string>
        ) => {
            state.token = action.payload;
        },
    },
});

export const { updateAccessToken } = accessTokenUpdate.actions;
export default accessTokenUpdate;