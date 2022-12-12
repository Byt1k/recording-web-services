import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ResponseRecordingDetail} from "../../api/types";
import {RootState} from "../store";
import {HYDRATE} from "next-redux-wrapper";

export interface RecordingDetailState {
    data: ResponseRecordingDetail | null
}

const initialState: RecordingDetailState = {
    data: null,
}

export const recordingDetailSlice = createSlice({
    name: 'recordingDetail',
    initialState,
    reducers: {
        setRecordingDetail: (state, action: PayloadAction<ResponseRecordingDetail>) => {
            state.data = action.payload
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return  {
                ...state,
                ...action.payload.recordingDetail
            }
        }
    }
})

export const {setRecordingDetail} = recordingDetailSlice.actions

export const selectRecordingDetail = (state: RootState) => state.recordingDetail.data

export const recordingDetailReducer = recordingDetailSlice.reducer;