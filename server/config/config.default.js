const validateSchema = require('../app/lib/validateSchema')
const $const = require('../app/lib/const')

// 读取配置文件 获取配置
let huiConsoleConfig = require('../huiconsole.config.js')
let { server: huiConsoleServerConfig } = huiConsoleConfig || {}

module.exports = app=>({
    keys: 'huiconsole-cookie-key',
    middleware: ['error', 'log'],
    jwtSecret: {
        user: 'huiconsole-jwtsecret',
        passwordChanging: 'huiconsole-jwtsecret2',
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
    ...huiConsoleServerConfig,
})