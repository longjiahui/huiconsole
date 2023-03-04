const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = (schema, options)=>{

    let useContext = model=>{
        return {
            async $(data){
                if(typeof data === 'string' || data instanceof Schema.Types.ObjectId){
                    // 视为ID
                    return (await model.findById(data))?.toObject?.()
                }
                return data
            }
        }
    }

    function filterData(data, fields = ''){
        if(fields){
            fields = fields.trim()
            let items = fields.split(' ')
            if(fields?.[0] === '-'){
                items.forEach(i=>{
                    delete data[i.slice(1)]
                })
            }else{
                data = items.reduce((t, i)=>{
                    if(data.hasOwnProperty(i)){
                        t[i] = data[i]
                    }
                    return t
                }, {})
            }
        }
        return data
    }

    schema.static('getChildren', async function(_id, {
        queryHandler = q=>q
    } = {}){
        return (await queryHandler(this.find({
            ancestors: _id,
        })))?.map?.(d=>d.toObject())
    })

    schema.static('saveInTree', async function(data, {
        // 可以提供进来避免重复计算
        oldData,

        fields,
        dataHandler = data=>data,
        dataHandlerWhenUpdate = data=>({$set: data}),
        dataHandlerWhenSave = data=>data,
        session,
    } = {}){
        let { $ } = useContext(this)

        let { _id } = data

        if(!oldData){
            if(_id){
                oldData = await $(_id)
            }
        }else{
            // !_id 意为新增
            if(_id){
                oldData = await $(oldData)
            }
        }

        data = filterData(data, fields)
        data = dataHandler(data)
        let savedDocument

        if(_id){
            data = dataHandlerWhenUpdate(data)
            savedDocument = await this.findByIdAndUpdate(_id, data, {
                session,
                new: true,
            })
        }else{
            data = dataHandlerWhenSave(data)
            savedDocument = filterData((await (new this(data)).save({session}))?.toObject?.() || {})
        }

        // onCreate || onChangeParent
        if(
            !oldData ||
            savedDocument.parent !== oldData?.parent
        ){
            await this._updateChildren(savedDocument._id, oldData?.parent, savedDocument?.parent)
            await this._updateAncestors(savedDocument._id, { data: savedDocument })
        }
        return savedDocument
    })

    schema.static('_updateChildren', async function(id, from, to){
        if(from){
            // pull
            await this.updateOne({
                _id: from, 
            }, {
                $pull: {
                    children: id,
                }
            })
        }
        if(to){
            await this.updateOne({
                _id: to,
            }, {
                $addToSet: {
                    children: id,
                }
            })
        }
    })

    schema.static('_getAncestors', async function(_id, { data, parentData } = {}){
        let { $ } = useContext(this)
        data = data ?
            await $(data)
            : (await this.findById(_id))?.toObject?.()
        if(data?.parent){
            parentData = parentData ? await $(parentData) : (await this.findById(data.parent))?.toObject?.()
        }
        return [...parentData?.ancestors || [],
            ...(parentData?._id ? [parentData._id] : [])]
    })

    schema.static('_updateAncestors', async function(planID, ...rest){
        let { $ } = useContext(this)
        let ancestors = await this._getAncestors(...arguments)
        await this.updateOne({
            _id: planID,
        }, {
            $set: {
                ancestors,
            }
        })
    })

    schema.add({
        parent: {
            type: Schema.Types.ObjectId,
            // ref: ()=>{console.debug(this), schema},
        },
        ancestors: [{
            type: Schema.Types.ObjectId,
            // ref: ()=>schema,
        }],
        children: [{
            type: Schema.Types.ObjectId,
            // ref: function(){console.debug(this, schema.name, schema.modelName), schema},
        }],
    })
}