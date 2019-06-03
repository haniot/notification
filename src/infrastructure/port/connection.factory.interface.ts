export interface IConnectionFactory {
    createConnection(retries: number, interval: number): Promise<any>
}
