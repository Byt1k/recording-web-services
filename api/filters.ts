import {AxiosInstance} from "axios";

export const filtersApi = (instance: AxiosInstance) =>  ({
    async getFilters() {
        const {data} = await instance.get('recordings/v1/profile')
        return data
    },
    async setFilters(newFilters) {
        return await instance.post('recordings/v1/profile', newFilters)
    }
})
