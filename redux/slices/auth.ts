import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ResponseAuth} from "../../api/types";
import {RootState} from "../store";
import {HYDRATE} from "next-redux-wrapper";

export interface AuthState {
    data: ResponseAuth | null
}

const initialState: AuthState = {
    data: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthUserData: (state, action: PayloadAction<ResponseAuth>) => {
            state.data = action.payload
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return  {
                ...state,
                ...action.payload.auth
            }
        }
    }
})

export const { setAuthUserData} = authSlice.actions

export const selectAuthUserData = (state: RootState) => state.auth.data

export const authReducer = authSlice.reducer;