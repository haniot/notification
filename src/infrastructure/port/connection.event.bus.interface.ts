export interface IConnectionEventBus {
    isOpen: boolean

    open(retries: number, interval: number): Promise<any>

    close(): Promise<boolean>

    dispose(): Promise<boolean>

    on(event: string, listener: (...args: any[]) => void): void

    publish(exchangeName: string,
            routingKey: string,
            message: any,
            options?: any): Promise<void>

    subscribe(queueName: string,
              exchangeName: string,
              routingKey: string,
              callback: (err: any, message: any) => void,
              options?: any): Promise<void>

    createRpcServer(queueName: string,
                    exchangeName: string,
                    routingKeys: string[],
                    options?: any): any

    rpcClient(exchangeName: string,
              resourceName: string,
              parameters: any[],
              options?: any): Promise<any>
}
