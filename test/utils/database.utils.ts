export class DatabaseUtils {
    public static async deleteMany(model: any, query?: any) {
        return await model.deleteMany(query || {})
    }

    public static async create(model: any, doc: any) {
        return await model.create(doc)
    }
}
