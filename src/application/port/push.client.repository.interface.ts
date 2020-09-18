export interface IPushClientRepository {
    run(): Promise<void>

    send(payload: any): Promise<any>

    sendToTopic(name: string, payload: any): Promise<any>
}
