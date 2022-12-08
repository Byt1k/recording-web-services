import {AxiosInstance} from "axios";

export const authApi = (instance: AxiosInstance) =>  ({
    async login(login, password) {
        const token = await instance.post('v1/authenticate', {username: login, password: password})
            .then(res => res.data.token)
        return token
    },

    async getMe() {
        const {data} = await instance.get('recordings/v1/interfacedata')
        return data
    }
})
