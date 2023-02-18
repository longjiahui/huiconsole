const validateSchema = require('../app/lib/validateSchema')
const $const = require('../app/lib/const')

module.exports = app=>({
    keys: 'my-cookie-secret-key',
    middleware: ['error', 'log'],
    jwtSecret: {
        user: 'test-haha',
        passwordChanging: 'test-haha2',
    },

    static: {
        prefix: '/',
    },

    multipart: {
        mode: 'file'
    },

    security: {
        csrf: {
            enable: false,
        }
    },

    mongoose: {
        client: {
            url: `mongodb://${$const.isProd ? 'mongo' : '127.0.0.1'}/huiconsole`,
            options: {
                useUnifiedTopology: true,
                useFindAndModify: false,
            },
        },
    },
    validateSchema,

    ...$const,
})