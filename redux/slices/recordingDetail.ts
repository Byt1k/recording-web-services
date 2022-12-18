import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RecordingItem, ResponseRecordingDetail} from "../../api/types";
import {RootState} from "../store";
import {HYDRATE} from "next-redux-wrapper";

type PlayingRecording = {
    recordid: string,
    isPlaying: boolean
}

export interface RecordingDetailState {
    data: RecordingItem | null,
    playingRecording: PlayingRecording
}

const initialState: RecordingDetailState = {
    data: null,
    playingRecording: {
        recordid: null,
        isPlaying: false
    }
}

export const recordingDetailSlice = createSlice({
    name: 'recordingDetail',
    initialState,
    reducers: {
        setRecordingDetail: (state, action: PayloadAction<RecordingItem>) => {
            state.data = action.payload
        },
        setIsPlaying: (state, action: PayloadAction<PlayingRecording>) => {
            state.playingRecording = action.payload
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

export const {setRecordingDetail, setIsPlaying} = recordingDetailSlice.actions

export const selectRecordingDetail = (state: RootState) => state.recordingDetail.data
export const selectRecordingIsPlaying = (state: RootState) => state.recordingDetail.playingRecording

export const recordingDetailReducer = recordingDetailSlice.reducer;