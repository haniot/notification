export interface IPushClientRepository {
    send(payload: any): Promise<any>

    sendToTopic(name: string, payload: any): Promise<any>
}
