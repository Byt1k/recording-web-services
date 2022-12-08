import {AxiosInstance} from "axios";

export const recordingsApi = (instance: AxiosInstance) => ({
    async search(dto) {
        const {data} = await instance.post('recordings/v1/search', dto)
        return data
    },

})