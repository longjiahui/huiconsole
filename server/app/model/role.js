module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema

    var RoleSchema = new Schema({
        name: {
            type: String,
            unique: true,
        },
        // 业务后管系统使用的字段，可以不填
        key: String,
        description: String,
        isAdmin: Boolean,
        menus: [{
            type: Schema.Types.ObjectId,
            ref: 'Menu',
        }]
    }, {
        timestamps: true,
    })

    return mongoose.model('Role', RoleSchema)
}