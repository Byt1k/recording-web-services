import {AxiosInstance} from "axios";

export const recordingsApi = (instance: AxiosInstance) => ({
    async search(dto) {
        const {data} = await instance.post('recordings/v1/search', dto)
        return data
    },
    async getRecordingDetail(recordingId: string) {
        const {data} = await instance.get(`/recordings/v1/${recordingId}/detail`)
        return data
    }

})