import {AxiosInstance} from "axios";
import {ResponseSearchRecordings} from "./types";

export const recordingsApi = (instance: AxiosInstance) => ({
    async search(dto) {
        const {data} = await instance.post<ResponseSearchRecordings>('recordings/v1/search', dto)

        const recordings = await Promise.all(data.items.map(async (r) => {
            if (r.record_count > 1) {
                const {data} = await instance.get(`recordings/v1/${r.callId}/conversation`)
                const recordingConversation = []
                data.items.map(item => {
                    if (item.recordid !== r.recordid) {
                        recordingConversation.push(item)
                    }
                })
                return {...r, record_count: recordingConversation.length, dependencies: recordingConversation}
            } else {
                return {...r, record_count: 0}
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
        const data = await instance.delete(`recordings/v1/${recordingId}`)
        return data
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