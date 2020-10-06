export interface IConnectionFirebase {
    firebase_admin: any

    init(): Promise<void>
}
