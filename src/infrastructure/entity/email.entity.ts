export class EmailEntity {
    public id?: string
    public from!: any
    public reply?: any
    public to!: Array<any>
    public cc?: Array<any>
    public bcc?: Array<any>
    public subject!: string
    public text?: string
    public html?: string
    public attachments?: Array<any>
    public created_at?: string
    public user_id?: string
}
