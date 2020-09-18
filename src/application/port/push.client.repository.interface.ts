export interface IPushClientRepository {
    run(): Promise<void>

    send(payload: any): Promise<any>
}
