import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ResponseSearchRecordings} from "../../api/types";
import {RootState} from "../store";
import {HYDRATE} from "next-redux-wrapper";

export interface RecordingsState {
    data: ResponseSearchRecordings | null
}

const initialState: RecordingsState = {
    data: null,
}

export const recordingsSlice = createSlice({
    name: 'recordings',
    initialState,
    reducers: {
        setRecordings: (state, action: PayloadAction<ResponseSearchRecordings>) => {
            state.data = action.payload
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return  {
                ...state,
                ...action.payload.recordings
            }
        }
    }
})

export const {setRecordings} = recordingsSlice.actions

export const selectSearchedRecordings = (state: RootState) => state.recordings.data

export const recordingsReducer = recordingsSlice.reducer;