module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema

    var UserSchema = new Schema({
        username: {
            type: String,
            unique: true,
        },
        name: String,
        password: String,
        avatar: String,
        description: String,

        role: { type: Schema.Types.ObjectId, ref: 'Role' },
    }, {
        timestamps: true,
    })

    return mongoose.model('User', UserSchema)
}