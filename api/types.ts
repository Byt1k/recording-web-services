export interface UserInfo {
    username: string,
    FirstName: string,
    LastName: string
}
export interface Capabilities {
    CanDetailView: 'true' | 'false',
    CanExport: 'true' | 'false',
    CanStandartForm: 'true' | 'false',
    CanRead: 'true' | 'false',
    CanDelete: 'true' | 'false'
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
    serviceTask: string,
    caseId: string,
    externalDN: string,
    recordingid: string,
    localDN: string,
    mediatype: string,
    username: string
}

export interface ResponseAuth {
    UserInfo: UserInfo[],
    Capabilities: Capabilities[],
    BusinessAttributes: BusinessAttributes[]
    Enums: {
        name: string,
        values: {
           name: string,
           displayName: string
        }[]
    }[],
    AdditionalSearchMetadata: string[],
    BusinessAttributesOrders: string[],
    StandardSearchMetadata: string[]
}

export interface RecordingItem {
    record_count: number
    callId: string,
    duration: number | string,
    externalDN: string,
    localDN: string,
    metadata: Array<any>,
    recordid: string,
    starttime: string,
    stoptime: string,
    type: string,
    username: string,
    mediatype: string,
    dependencies?: RecordingItem[]
}

export interface ResponseSearchRecordings {
    items: RecordingItem[]
}

interface RecordingDetail {

}

export interface ResponseRecordingDetail {
    items: RecordingDetail[]
}