import {GetServerSidePropsContext, NextPageContext} from "next";
import {authApi} from "./auth";
import Cookies, {parseCookies} from "nookies";
import axios from "axios";
import {recordingsApi} from "./recordings";
import * as https from "https";


export type ApiReturnType = {
    auth: ReturnType<typeof authApi>,
    recordings: ReturnType<typeof recordingsApi>
}

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

export const Api = (ctx? : NextPageContext | GetServerSidePropsContext): ApiReturnType => {
    const cookies = ctx ? Cookies.get(ctx) : parseCookies()
    const token = cookies.rwsAuthToken

    const instance = axios.create({
        baseURL: 'https://recording:8443/',
        // baseURL: 'http://95.165.29.71:8080/',
        headers: {
            Authorization: 'Bearer ' + token
        },
        httpsAgent
    })





    return {
        auth: authApi(instance),
        recordings: recordingsApi(instance)
    }

}