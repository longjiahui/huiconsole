module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema

    var UserSchema = new Schema({
        username: {
            type: String,
            unique: true,
        },
        nickname: String,
        password: String,
        avatar: String,
        description: String,

        // role: String,
    }, {
        timestamps: true,
    })

    return mongoose.model('User', UserSchema)
}