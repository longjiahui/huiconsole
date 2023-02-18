module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema

    var RoleSchema = new Schema({
        // 业务后管系统使用的字段
        key: {
            type: String,
            unique: true,
        },
        name: String,
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