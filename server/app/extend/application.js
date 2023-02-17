const $const = require('../lib/const')

module.exports = {
    get ObjectID(){
        return this.mongoose.Types.ObjectId
    }, 
    get ObjectId(){
        return this.mongoose.Types.ObjectId
    }, 
    ...$const,
}