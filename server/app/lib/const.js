let isProd = process.env.NODE_ENV === 'production'
let isDev = process.env.NODE_ENV === 'development'

module.exports = {
    isProd,
    isDev,
} 