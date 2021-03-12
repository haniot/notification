import { PushTypes, Push } from '../../../src/application/domain/model/push'
import { GeneratorMock } from '../generator.mock'
import { ChoiceTypes } from '../../../src/application/domain/utils/choice.types'
import { PushMessageMock } from './push.message.mock'

export class PushMock {

    public generate(type?: string, to?: Array<string>): Push {
        const push: Push = new Push()
        push.id = GeneratorMock.generateObjectId()
        push.type = type ? type : this.generateType()
        push.keep_it = push.type === PushTypes.DIRECT ? ChoiceTypes.YES : ChoiceTypes.NO
        if (push.keep_it === ChoiceTypes.YES) push.is_read = ChoiceTypes.NO
        push.to = to ? to : [GeneratorMock.generateObjectId()]
        push.message = new PushMessageMock().generate()
        push.createdAt = '2020-11-18T02:40:10.752Z'
        push.user_id = GeneratorMock.generateObjectId()

        return push
    }

    private generateType(): PushTypes {
        const pushTypes = {
            0: PushTypes.DIRECT,
            1: PushTypes.TOPIC
        }

        return pushTypes[Math.floor((Math.random() * 2))] // 0-1
    }
}
