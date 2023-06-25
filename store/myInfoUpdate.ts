import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface MyInfoState {
    name : string;
    nickname : string;
    address : string;
    phone : string;
    email : string;
    links : Array<string>;
    profileImg : string;
    overviewImg : string;
    longitude : number;
    latitude : number
    role : string;
}

const initialState: MyInfoState = {
    name : '',
    nickname : '',
    address : '',
    phone : '',
    email : '',
    links : [],
    profileImg : '',
    overviewImg : '',
    longitude : 0.0,
    latitude : 0.0,
    role : '',
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
        updateProfileImg: (
            state: MyInfoState,
            action: PayloadAction<string>
        ) => {
            state.profileImg = action.payload;
        },
        updateOverviewImg: (
            state: MyInfoState,
            action: PayloadAction<string>
        ) => {
            state.overviewImg = action.payload;
        },
        updateRole: (
            state: MyInfoState,
            action: PayloadAction<string>
        ) => {
            state.role = action.payload;
        },
        updateLinks: (
            state: MyInfoState,
            action: PayloadAction<Array<string>>
        ) => {
            state.links = action.payload;
        },
        updateLongitude: (
            state: MyInfoState,
            action: PayloadAction<number>
        ) => {
            state.longitude = action.payload;
        },
        updateLatitude: (
            state: MyInfoState,
            action: PayloadAction<number>
        ) => {
            state.latitude = action.payload;
        },
    },
});

export const { 
    updateName, updateNickname, updateAddress, 
    updatePhone, updateEmail, updateLinks,
    updateOverviewImg, updateProfileImg,
    updateLongitude, updateLatitude, updateRole,
} = myInfoUpdate.actions;
export default myInfoUpdate;