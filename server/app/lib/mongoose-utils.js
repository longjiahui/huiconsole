const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = (schema, options)=>{

    let {
        queryHandler = q=>q,
        completeQueryHandler = q=>q,
        dataHandler = d=>d,
    } = options || {}

    schema.static('getDatas', async function(query, isComplete = true){
        let q = this.find(query)
        q = queryHandler(q)
        if(isComplete){
            q = completeQueryHandler(q)
        }
        return dataHandler((await q)?.map?.(d=>d.toObject()))
    })
    schema.static('getData', async function(...rest){
        return (await this.getDatas(...rest))?.[0]
    })
    schema.static('getDataByID', async function(_id, isComplete){
        return this.getData({ _id }, isComplete)
    })
    schema.static('$', async function(data, isComplete){
        if(typeof data === 'string' || data instanceof Schema.Types.ObjectId){
            // 视为ID
            return await this.getDataByID(data, isComplete)
        }
        return data
    })
}