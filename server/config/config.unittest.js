const path = require('path')

module.exports = {
    consoleLevel: 'NONE', 
    level: 'NONE', 
    logger: {
        dir: path.resolve(path.join('logs', 'huiconsole-unittest')),
    },
}