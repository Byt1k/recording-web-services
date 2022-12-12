import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit'
import {createWrapper} from 'next-redux-wrapper';
import {authReducer} from "./slices/auth";
import {recordingsReducer} from "./slices/recordings";
import {recordingDetailReducer} from "./slices/recordingDetail";

export function makeStore() {
    return configureStore({
        reducer: {
            auth: authReducer ,
            recordings: recordingsReducer,
            recordingDetail: recordingDetailReducer
        }
    })
}

export const store = makeStore()

export type RootStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<RootStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;

export type AppDispatch = typeof store.dispatch

// export const wrapper = createWrapper<RootStore>(makeStore, {debug: true});
export const wrapper = createWrapper<RootStore>(makeStore);
