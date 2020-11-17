import { JsonUtils } from '../../../src/application/domain/utils/json.utils'
import { assert } from 'chai'

describe('UTILS: JsonUtils', () => {
    describe('isJsonString()', () => {
        context('when validate if a string is a json', () => {
            it('should return true', () => {
                const res: boolean = JsonUtils.isJsonString('{"a": "1"}')
                assert.isTrue(res)
            })
        })
        context('when a string is invalid', () => {
            it('should return false', () => {
                const res: boolean = JsonUtils.isJsonString('invalid')
                assert.isFalse(res)
            })
        })
        context('when a string is empty', () => {
            it('should return false', () => {
                const res: boolean = JsonUtils.isJsonString('')
                assert.isFalse(res)
            })
        })
    })
})
