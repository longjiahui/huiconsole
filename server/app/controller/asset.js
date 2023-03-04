module.exports = app => class extends app.Controller {
    async pageData(ctx){
        ctx.body = await this.service.ret.pageData({
            model: ctx.model.Asset,
        })
    }

    async save(ctx){
        await ctx.v({
            _id$: 'objectID$',
            name$: 'string$',
            type$: 'string$',
            url$: val=>!val || /^https?:\/\//.test(val),
        })

        ctx.body = await this.service.ret.save({
            model: ctx.model.Asset,
            fields: 'name type url',
        })
    }

    async delete(ctx){
        await ctx.v({
            _id: 'objectID',
        })
        let { _id } = ctx.request.body
        await ctx.model.Asset.deleteOne({ _id })
        ctx.body = this.service.ret.success()
    }
}