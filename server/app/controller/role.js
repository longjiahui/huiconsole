module.exports = app => class extends app.Controller {
    async dict(ctx){
        ctx.body = this.service.ret.success(await ctx.model.Role.find(null, 'name key'))
    }

    async pageData(ctx){
        await ctx.v({
            keyword: 'string$',
        })

        let { keyword } = ctx.request.body
        let condition = {}
        if(keyword){
            if(!condition.$or){
                condition.$or = []
            }
            let keywordRegExp = new RegExp(`.*${keyword}.*`)
            ;['key', 'name', 'description'].forEach(k=>{
                condition.$or.push({[k]: keywordRegExp})
            })
        }

        ctx.body = await this.service.ret.pageData({
            model: ctx.model.Role,
            condition,
            dataHandler: ds=>Promise.all(ds.map(async d=>{
                d = d.toObject()
                d.userAmount = await ctx.model.User.countDocuments({ role: d._id })
                return d
            })),
            queryHandler: q=>q.sort({ isAdmin: 1, createdAt: 1, })
        })
    }

    async save(ctx){
        await ctx.v({
            _id$: 'objectID',
            key$: 'string',
            name$: 'string$',
            description$: 'string$',
            isAdmin$: 'boolean',
            menus$: 'array[objectID]',
        })
        let user = ctx.state.user
        let { _id, isAdmin } = ctx.request.body
        if(!!_id){
            let role = await ctx.model.Role.findById(_id)
            if(!role){
                throw new app.Error(0, '角色不存在')
            }
            if(role.isAdmin && !isAdmin){
                // 不能取消自己的管理员权限
                let newestUser = await ctx.model.User.findById(user._id)
                if(String(newestUser.role) === String(role._id)){
                    throw new app.Error(0, '不能取消自己的管理员权限')
                }
            }
        }

        ctx.body = await this.service.ret.save({
            model: ctx.model.Role,
            fields: '_id key name description isAdmin menus',
        })
    }

    async delete(ctx){
        await ctx.v({
            _id: 'objectID',
        })
        let { _id } = ctx.request.body
        if((await ctx.model.User.find({ role: _id }))?.length > 0){
            throw new app.Error(0, '该角色下有用户，请先修改用户角色。')
        }
        await ctx.model.Role.deleteOne({ _id })
        ctx.body = this.service.ret.success()
    }
}