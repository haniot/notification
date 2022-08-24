import { GeneratorMock } from '../generator.mock'
import { PushTokenClientTypes } from '../../../src/application/domain/model/push.token'
import { PushTypes } from '../../../src/application/domain/model/push'
import { ChoiceTypes } from '../../../src/application/domain/utils/choice.types'

export abstract class DefaultEntityMock {
    // MODELS
    public static readonly ADDRESS: any = {
        name: 'Default Sender',
        email: 'default_email@mail.com'
    }

    public static readonly FROM_ADDRESS: any = {
        name: 'Default From Sender',
        email: 'default_from_email@mail.com'
    }

    public static readonly TO_ADDRESS: any = {
        name: 'Default To Sender',
        email: 'default_to_email@mail.com'
    }

    public static readonly ATTACHMENT: any = {
        filename: 'Default Filename',
        path: 'path/default_attachment',
        content_type: 'default_content_type'
    }

    public static readonly EMAIL: any = {
        id: GeneratorMock.generateObjectId(),
        from: DefaultEntityMock.FROM_ADDRESS,
        reply: DefaultEntityMock.ADDRESS,
        to: [DefaultEntityMock.TO_ADDRESS],
        cc: [DefaultEntityMock.TO_ADDRESS],
        bcc: [DefaultEntityMock.TO_ADDRESS],
        subject: 'Default Subject',
        text: 'Default Text',
        html: 'Default HTML',
        attachments: [DefaultEntityMock.ATTACHMENT],
        created_at: new Date().toISOString(),
        user_id: GeneratorMock.generateObjectId(),
        template: 'Default Template',
        link: 'Default Link'
    }

    public static readonly PILOT_STUDY_DATA_EMAIL: any = {
        to: DefaultEntityMock.ADDRESS,
        attachments: [DefaultEntityMock.ATTACHMENT],
        pilot_study: 'Default Pilot',
        request_date: new Date().toISOString(),
        action_url: 'https://localhost',
        lang: 'pt-BR'
    }

    public static readonly RESET_PASSWORD_EMAIL: any = {
        to: DefaultEntityMock.ADDRESS,
        action_url: 'https://localhost',
        lang: 'pt-BR'
    }

    public static readonly UPDATE_PASSWORD_EMAIL: any = {
        to: DefaultEntityMock.ADDRESS,
        action_url: 'https://localhost',
        lang: 'pt-BR'
    }

    public static readonly WELCOME_EMAIL: any = {
        to: DefaultEntityMock.ADDRESS,
        action_url: 'https://localhost',
        password: 'user_pass',
        lang: 'pt-BR'
    }

    public static readonly PUSH_MESSAGE: any = {
        type: 'notification-type',
        pt: {
            title: 'Isto é um título.',
            text: 'Isto é um texto.'
        },
        en: {
            title: 'This is a title.',
            text: 'This is a text.'
        }
    }

    public static readonly PUSH_TOKEN: any = {
        id: GeneratorMock.generateObjectId(),
        user_id: GeneratorMock.generateObjectId(),
        client_type: PushTokenClientTypes.MOBILE,
        token: GeneratorMock.generateRandomString(40)
    }

    public static readonly PUSH: any = {
        id: GeneratorMock.generateObjectId(),
        created_at: '2020-11-18T02:40:10.752Z',
        type: PushTypes.DIRECT,
        timestamp: new Date('2020-11-18T02:40:10.752Z'),
        keep_it: ChoiceTypes.YES,
        is_read: ChoiceTypes.NO,
        to: [GeneratorMock.generateObjectId()],
        message: DefaultEntityMock.PUSH_MESSAGE,
        user_id: GeneratorMock.generateObjectId()
    }

    public static readonly USER: any = {
        id: GeneratorMock.generateObjectId(),
        type: GeneratorMock.generateUserType()
    }
}
