const tree = require('../lib/mongoose-tree')
const utils = require('../lib/mongoose-utils')

module.exports = app=>{
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
  
    var MenuSchema = new Schema({
      name: String,
      icon: String,
      data: {
        type: Schema.Types.Mixed,
      },
      type: {
        type: String,
        enum: Object.values(app.MT),
        default: app.MT.COMPONENT,
      },
      
      isTransparent: Boolean, // iframe transparent

      // 内部使用的order字段
      order: Number,
    }, {
      timestamps: true,
    })
  
    MenuSchema.plugin(utils, {
      queryHandler: q=>q.populate('data.preloadAssets')
    })
    MenuSchema.plugin(tree)
    return mongoose.model('Menu', MenuSchema)
  }