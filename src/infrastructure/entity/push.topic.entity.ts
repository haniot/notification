import { Entity } from './entity'

export class PushTopicEntity extends Entity{
    public to?: string
    public registration_tokens?: Array<string>
}
