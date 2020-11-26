import { User } from '../../../src/application/domain/model/user'
import { GeneratorMock } from '../generator.mock'

export class UserMock {

    public generate(type?: string): User {
        const user: User = new User()
        user.id = GeneratorMock.generateObjectId()
        user.type = type ? type : GeneratorMock.generateUserType()

        return user
    }
}
