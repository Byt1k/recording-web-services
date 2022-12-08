export interface UserInfo {
    username: string,
    FirstName: string,
    LastName: string
}
export interface Capabilities {
    CanDetailView: "true",
    CanExport: "false",
    CanStandartForm: "false",
    CanRead: "true",
    CanDelete: "true"
}
export interface BusinessAttributes {
    callId: string,
    serviceType: string,
    businessResult: string,
    starttime: string,
    stoptime: string,
    type: string,
    globalInterationOrigin: string,
    serviceName: string,
    CustomerType: string,
    duration: string,
    Project: string,
    path: string,
    rec_type: string,
    serviceTask: string,
    customerSegment: string,
    caseId: string,
    externalDN: string,
    recordingid: string,
    localDN: string,
    waveform_path: string,
    username: string
}

export interface ResponseAuth {
    UserInfo: UserInfo[],
    Capabilities: Capabilities[],
    BusinessAttributes: BusinessAttributes[]
}