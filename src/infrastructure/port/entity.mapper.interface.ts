import { Entity } from '../../application/domain/model/entity'

export interface IEntityMapper<M extends Entity, EM> {
    transform(item: any): any

    modelToModelEntity(item: M): EM

    jsonToModel(json: any): M
}
