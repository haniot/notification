/**
 * JSON Deserializable.
 * Convert JSON to Object.
 *
 * @template T
 */
export interface IJSONDeserializable<T> {
    fromJSON(json: any): T
}
