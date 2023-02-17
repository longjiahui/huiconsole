module.exports = app=>{
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
  
    var MenuSchema = new Schema({
      name: String,
      icon: String,
      data: String,
      
      isTransparent: Boolean, // iframe transparent
      parent: { type: Schema.Types.ObjectId, ref: 'Menu' },
      subMenus: [{
        type: Schema.Types.ObjectId, ref: 'Menu'
      }],

      // 内部使用的order字段
      order: Number,
    }, {
      timestamps: true,
    })
  
    return mongoose.model('Menu', MenuSchema)
  }