import { Entity } from './entity'

export class EmailEntity extends Entity {
    public from!: any
    public reply?: any
    public to!: Array<any>
    public cc?: Array<any>
    public bcc?: Array<any>
    public subject!: string
    public text?: string
    public html?: string
    public attachments?: Array<any>
    public user_id?: string
}
