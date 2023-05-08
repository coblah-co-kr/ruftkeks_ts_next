import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface MyInfoState {
    name : string;
    nickname : string;
    address : string;
    phone : string;
    email : string;
}

const initialState: MyInfoState = {
    name : '',
    nickname : '',
    address : '',
    phone : '',
    email : '',
}

const myInfoUpdate = createSlice({
    name: "myInfo",
    initialState,
    reducers: {
        updateName: (
            state: MyInfoState,
            action: PayloadAction<string>
        ) => {
            state.name = action.payload;
        },
        updateNickname: (
            state: MyInfoState,
            action: PayloadAction<string>
        ) => {
            state.nickname = action.payload;
        },
        updateAddress: (
            state: MyInfoState,
            action: PayloadAction<string>
        ) => {
            state.address = action.payload;
        },
        updatePhone: (
            state: MyInfoState,
            action: PayloadAction<string>
        ) => {
            state.phone = action.payload;
        },
        updateEmail: (
            state: MyInfoState,
            action: PayloadAction<string>
        ) => {
            state.email = action.payload;
        },
    },
});

export const { 
    updateName, updateNickname, updateAddress, 
    updatePhone, updateEmail 
} = myInfoUpdate.actions;
export default myInfoUpdate;