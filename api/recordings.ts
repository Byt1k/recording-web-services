import {AxiosInstance} from "axios";
import {ResponseSearchRecordings} from "./types";

export const recordingsApi = (instance: AxiosInstance) => ({
    async search(dto) {
        const {data} = await instance.post<ResponseSearchRecordings>('recordings/v1/search', dto)
        return data
    },
    async getRecordingDetail(recordingId: string) {
        const {data} = await instance.get(`recordings/v1/${recordingId}/detail`)
        return data
    },
    async getRecordingConversation(callId: string) {
        const {data} = await instance.get(`recordings/v1/${callId}/conversation`)
        return data.items
    },
    async deleteRecording(recordingId: string) {
        return await instance.delete(`recordings/v1/${recordingId}`)
    },
    async downloadRecording(fileName: string) {
        const response = await instance.get(`recordings/v1/recordfiles/${fileName}`, {responseType: 'blob'})
        if (response.status === 200) {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            link.remove()
        }
        return response
    }
})