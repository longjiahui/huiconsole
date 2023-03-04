module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema

    var AssetSchema = new Schema({
        name: String,
        type: {
            type: String,
            enum: Object.values(app.ASSET),
        },
        url: String,
    }, {
        timestamps: true,
    })

    return mongoose.model('Asset', AssetSchema)
}