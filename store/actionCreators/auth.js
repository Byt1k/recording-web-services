import {instance} from "../../api";
import {SET_AUTH_USER_DATA} from "../reducers/authReducer";

export const setAuthUserData = (login, password) => {
    return async (dispatch) => {
        try {
            const token = await instance.post('v1/authenticate', {username: login, password: password})
                .then(res => res.data.token)
            const data = await instance.get('recordings/v1/interfacedata', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(res => res.data)
            dispatch({type: SET_AUTH_USER_DATA, isAuth: true, payload: data})
        } catch (e) {

        }
    }
}