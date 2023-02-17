const Controller = require('egg').Controller

module.exports = class extends Controller{
    async save(ctx){
        await ctx.v({
            _id$: 'objectID$',
            $model: 'modelName'
        })
        let { _id, $model, $set } = ctx.request.body

        // delete ctx.request.body.$model
        // 删掉所有$开头的参数
        Object.keys(ctx.request.body).map(k=>/^\$/.test(k)?k:'').forEach(k=>k?delete ctx.request.body[k]:'')
        ctx.request.body.$set = $set

        let ret = ctx.request.body
        if(!_id){
            ret = await (new ctx.model[$model](ctx.request.body)).save()
        }else{
            ret = await ctx.model[$model].findOneAndUpdate({
                _id
            }, ctx.request.body, {
                new: true
            })
        }
        ctx.body = this.service.ret.success(ret)
    }

    async get(ctx){
        await ctx.v({
            _id: 'objectID',
            $model: 'modelName'
        })
        let { _id, $model } = ctx.request.body
        ctx.body = this.service.ret.success(await ctx.model[$model].findById(_id))
    }

    async pageData(ctx){
        await ctx.v({
            // _id: 'objectID',
            page$: 'number',
            pageSize$: 'number',
            $model: 'modelName',
            $condition$: 'object',
            $sort: {$or: ['string', 'object']},
            $projection$: {$or: ['string', 'object']},
        })
        let { $model, $condition, $projection, $sort } = ctx.request.body
        let options = {model: ctx.model[$model]}
        if($condition){
            options.condition = $condition
        }
        if($projection){
            options.projection = $projection
        }
        if($sort){
            options.queryHandler = query=>query.sort($sort)
        }
        ctx.body = await this.service.ret.pageData(options)
    }

    async delete(ctx){
        await ctx.v({
            _id$: 'objectID',
            ids$: 'array[string]',
            $model: 'modelName',
            $: val=>{
                return val._id || val.ids
            }
        })

        let { _id, ids, $model } = ctx.request.body
        if(!ids){
            ids = []
        }
        if(_id){
            ids.push(_id)
        }
        await ctx.model[$model].deleteMany({_id: {$in: ids}})
        ctx.body = this.service.ret.success()
    }
}