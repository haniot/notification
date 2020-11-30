import http from 'http'

export class GeneratorMock {

    public static generateObjectId(): string {
        const chars = 'abcdef0123456789'
        let randS = ''
        for (let i = 0; i < 24; i++) {
            randS += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return randS
    }

    public static generateRandomString(max_length: number): string {
        const chars: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let randS = ''
        for (let i = 0; i < max_length; i++) {
            randS += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return randS
    }

    public static generateUserType(): string {
        const userTypes = {
            0: 'admin',
            1: 'health_professional',
            2: 'patient'
        }

        return userTypes[Math.floor((Math.random() * 3))] // 0-2
    }

    public static async generateEmailTemp(email): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const options = {
                host: 'api.guerrillamail.com',
                port: 80,
                path: `/ajax.php?f=set_email_user&email_user=${email}`
            }
            const request = http.get(options, res => GeneratorMock._onResponse(res, resolve, reject))

            /* if there's an error, then reject the Promise
             * (can be handled with Promise.prototype.catch) */
            request.on('error', reject)

            request.end()
        })
    }

    private static _onResponse(response, resolve, reject) {
        const hasResponseFailed = response.status >= 400
        let responseBody = ''

        if (hasResponseFailed) {
            reject(`Request to ${response.url} failed with HTTP ${response.status}`)
        }

        /* the response stream's (an instance of Stream) current data. See:
         * https://nodejs.org/api/stream.html#stream_event_data */
        response.on('data', chunk => responseBody += chunk.toString())

        // once all the data has been read, resolve the Promise
        response.on('end', () => resolve(responseBody))
    }

    public static generateLoremIpsum(length: number): string {
        let result = ''
        const words = [
            'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
            'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero',
            'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut',
            'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia',
            'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis',
            'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros',
            'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa',
            'volutpat', 'venenatis', 'sed', 'eu', 'molestie', 'lacus',
            'quisque', 'porttitor', 'ligula', 'dui', 'mollis', 'tempus',
            'at', 'magna', 'vestibulum', 'turpis', 'ac', 'diam',
            'tincidunt', 'id', 'condimentum', 'enim', 'sodales', 'in',
            'hac', 'habitasse', 'platea', 'dictumst', 'aenean', 'neque',
            'fusce', 'augue', 'leo', 'eget', 'semper', 'mattis',
            'tortor', 'scelerisque', 'nulla', 'interdum', 'tellus', 'malesuada',
            'rhoncus', 'porta', 'sem', 'aliquet', 'et', 'nam',
            'suspendisse', 'potenti', 'vivamus', 'luctus', 'fringilla', 'erat',
            'donec', 'justo', 'vehicula', 'ultricies', 'varius', 'ante',
            'primis', 'faucibus', 'ultrices', 'posuere', 'cubilia', 'curae',
            'etiam', 'cursus', 'aliquam', 'quam', 'dapibus', 'nisl',
            'feugiat', 'egestas', 'class', 'aptent', 'taciti', 'sociosqu',
            'ad', 'litora', 'torquent', 'per', 'conubia', 'nostra',
            'inceptos', 'himenaeos', 'phasellus', 'nibh', 'pulvinar', 'vitae',
            'urna', 'iaculis', 'lobortis', 'nisi', 'viverra', 'arcu',
            'morbi', 'pellentesque', 'metus', 'commodo', 'ut', 'facilisis',
            'felis', 'tristique', 'ullamcorper', 'placerat', 'aenean', 'convallis',
            'sollicitudin', 'integer', 'rutrum', 'duis', 'est', 'etiam',
            'bibendum', 'donec', 'pharetra', 'vulputate', 'maecenas', 'mi',
            'fermentum', 'consequat', 'suscipit', 'aliquam', 'habitant', 'senectus',
            'netus', 'fames', 'quisque', 'euismod', 'curabitur', 'lectus',
            'elementum', 'tempor', 'risus', 'cras'
        ]

        while (length--) {
            result += words[Math.floor(Math.random() * words.length)] + ' '
        }
        return result
    }
}
