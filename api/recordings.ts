import {AxiosInstance} from "axios";
import {ResponseSearchRecordings} from "./types";

export const recordingsApi = (instance: AxiosInstance) => ({
    async search(dto) {
        const {data} = await instance.post<ResponseSearchRecordings>('recordings/v1/search', dto)
        const recordings = await Promise.all(data.items.map(async (r) => {
            if (r.record_count > 1) {
                const {data} = await instance.get(`recordings/v1/${r.callId}/conversation`)
                const recordingConversation = data.items
                return {...r, dependencies: recordingConversation}
            } else {
                return r
            }
        }))
        return {items: recordings}
    },
    async getRecordingDetail(recordingId: string) {
        const {data} = await instance.get(`recordings/v1/${recordingId}/detail`)
        return data
    },
    // async getRecordingConversation(callId: string) {
    //     const {data} = await instance.get(`recordings/v1/${callId}/conversation`)
    //     return data
    // }
    async deleteRecording(recordingId: string) {
        const {data} = await instance.delete(`recordings/v1/${recordingId}`)
        return data
    }
})