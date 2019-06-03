export class JsonUtils {
    /**
     * Checks if a string is in json format.
     *
     * @param str
     */
    public static isJsonString(str): boolean {
        try {
            JSON.parse(str)
        } catch (e) {
            return false
        }
        return true
    }
}
