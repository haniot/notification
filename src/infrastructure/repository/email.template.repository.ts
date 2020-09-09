import { injectable } from 'inversify'
import { IEmailTemplateRepository } from '../../application/port/email.template.repository.interface'
import { EmailTemplate } from '../../application/domain/model/email.template'
import path from 'path'
import fs from 'fs'

@injectable()
export class EmailTemplateRepository implements IEmailTemplateRepository {
    private readonly _path: string

    constructor() {
        this._path = path.resolve(process.cwd(), 'dist', 'src', 'ui', 'templates', 'emails')
    }

    public async update(item: EmailTemplate): Promise<EmailTemplate> {
        try {
            await fs.writeFileSync(`${this._path}/${item.type}/html.pug`, Buffer.from(item.html?.buffer!))
            await fs.writeFileSync(`${this._path}/${item.type}/subject.pug`, Buffer.from(item.subject?.buffer!))
            await fs.writeFileSync(`${this._path}/${item.type}/text.pug`, Buffer.from(item.text?.buffer!))
            return Promise.resolve(item)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async findByTypeAndResource(type: string, resource: string): Promise<Buffer> {
        try {
            const result: Buffer = await fs.readFileSync(`${this._path}/${type}/${resource}.pug`)
            return Promise.resolve(Buffer.from(result))
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
