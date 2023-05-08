import { AnyAction, CombinedState, Reducer, combineReducers } from "redux";
import accessTokenUpdate, { TokenState } from "./accessTokenUpdate";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import { configureStore } from "@reduxjs/toolkit";
import myInfoUpdate, { MyInfoState } from "./myInfoUpdate";

export interface RootState {
    accessToken: TokenState;
    myInfo: MyInfoState;
}

const RootReducer = (
    state: RootState,
    action: AnyAction
): CombinedState<RootState> => {
    if (action.type === HYDRATE) return { ...state, ...action.payload };
    const combinedReducer = combineReducers({
        accessToken: accessTokenUpdate.reducer,
        myInfo: myInfoUpdate.reducer,
    });
    return combinedReducer(state, action);
};

const makeStore = () =>
    configureStore({
        reducer: RootReducer as Reducer<CombinedState<RootState>, AnyAction>,
        devTools: process.env.NODE_ENV === "development",
    });

export const wrapper = createWrapper(makeStore);