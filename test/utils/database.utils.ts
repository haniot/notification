export class DatabaseUtils {
    public static async deleteMany(model: any, query?: any) {
        return await model.deleteMany(query || {})
    }
}
