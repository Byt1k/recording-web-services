import { GetServerSidePropsContext, NextPageContext } from "next";
import { authApi } from "./auth";
import Cookies, { parseCookies } from "nookies";
import axios from "axios";
import { recordingsApi } from "./recordings";
import * as https from "https";
import {filtersApi} from "./filters";

export type ApiReturnType = {
    auth: ReturnType<typeof authApi>,
    recordings: ReturnType<typeof recordingsApi>
    filters: ReturnType<typeof filtersApi>
}

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    cert: `-----BEGIN TRUSTED CERTIFICATE-----
MIICuTCCAiICCQCsCeRMR64reDANBgkqhkiG9w0BAQsFADCBoDELMAkGA1UEBhMC
UlUxETAPBgNVBAgMCFZsYWRpbWlyMREwDwYDVQQHDAhWbGFkaW1pcjEaMBgGA1UE
CgwRQ29tcGxleC1Tb2x1dGlvbnMxEDAOBgNVBAsMB0dlbmVzeXMxHzAdBgNVBAMM
FkNvbXBsZXgtU29sdXRpb25zIFJvb3QxHDAaBgkqhkiG9w0BCQEWDXRlc3RAbWFp
bC5jb20wHhcNMjIxMjEzMDU0NTAzWhcNMjMxMjEzMDU0NTAzWjCBoDELMAkGA1UE
BhMCUlUxETAPBgNVBAgMCFZsYWRpbWlyMREwDwYDVQQHDAhWbGFkaW1pcjEaMBgG
A1UECgwRQ29tcGxleC1Tb2x1dGlvbnMxEDAOBgNVBAsMB0dlbmVzeXMxHzAdBgNV
BAMMFkNvbXBsZXgtU29sdXRpb25zIFJvb3QxHDAaBgkqhkiG9w0BCQEWDXRlc3RA
bWFpbC5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAO52xR2FzWJnIFHt
eYU1k6diXJ3HUFUEeF+HHw5lY0thsPg28K2Bkkzqppwue7pMIneb1xfcHkCrOZgQ
NgeimhPm0aqZif4MKG1JrOcmZCSPG1W4xyVhgCTec4AxT/CsHPiuHlTfURM9eyjU
CcCSTkmM7KGIShsEjhMXOhaK7XbDAgMBAAEwDQYJKoZIhvcNAQELBQADgYEApVWa
BRFDeq3V2ZESrfbslm8fs2JzAQHUZwr813ElPyNIHmNSzQk1cKFELoKm/bW3kiSC
AKtzwK+GmHEzJS0LSNfREdCk+uhlR+C78aXqZFGW4xhSSbAqugKNbKnRoSCc0Hqi
MSeg91ilsgNFco7Qrkmzyv5C16DioU6AUe6KuqY=
-----END TRUSTED CERTIFICATE-----
`
});

export const Api = (ctx?: NextPageContext | GetServerSidePropsContext): ApiReturnType => {
    const cookies = ctx ? Cookies.get(ctx) : parseCookies()
    const token = cookies.rwsAuthToken

    const instance = axios.create({
        baseURL: 'https://recording:8443/',
        headers: {
            Authorization: 'Bearer ' + token
        },
        httpsAgent
    })

    return {
        auth: authApi(instance),
        recordings: recordingsApi(instance),
        filters: filtersApi(instance)
    }
}