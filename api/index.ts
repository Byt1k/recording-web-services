import {GetServerSidePropsContext, NextPageContext} from "next";
import {authApi} from "./auth";
import Cookies, {parseCookies} from "nookies";
import axios from "axios";

export type ApiReturnType = {
    auth: ReturnType<typeof authApi>
}

export const Api = (ctx? : NextPageContext | GetServerSidePropsContext): ApiReturnType => {
    const cookies = ctx ? Cookies.get(ctx) : parseCookies()
    const token = cookies.rwsAuthToken

    const instance = axios.create({
        baseURL: 'https://95.165.29.71:8080/',
        headers: {
            Authorization: 'Bearer ' + token
        }
    })

    return {
        auth: authApi(instance)
    }

}