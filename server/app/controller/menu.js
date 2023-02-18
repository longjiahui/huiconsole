const sortPipeline = [{$sort: { order: 1 }}]

module.exports = app => class extends app.Controller{

    async pageData(ctx){
        let user = ctx.state.user
        let newestUser = await this.service.user.getFullUserByID(user._id)
        let menusFilter = []
        if(!newestUser?.role?.isAdmin){
            menusFilter = [{$match: { _id: {$in: newestUser.role.menus || []}}}]
        }
        ctx.body = await this.service.ret.pageDataByAggregate({
            model: ctx.model.Menu,
            pipeline: [{
                $match: {
                    parent: null,
                }
            }, ...menusFilter ],
            sortPipeline: sortPipeline,
            suffixPipeline: [...this.service.menu.createSubMenusLookupOption([...menusFilter, ...sortPipeline])]
        })
    }

    async save(ctx){
        await ctx.v({
            _id$: 'objectID$',
            name$: 'string',
            icon$: 'string$',
            data$: 'string$',
            parent$: 'objectID$',
        })

        let { _id, name, icon, data, parent } = ctx.request.body

        if(!!parent && !await ctx.model.Menu.findById(parent)){
            throw new app.Error(0, '父菜单不存在')
        }

        let isEdit = !!_id
        if(isEdit){
            let menu = await ctx.model.Menu.findById(_id)
            if(String(parent || null) !== String(menu.parent || null)){
                // change parent
                if(!!menu.parent){
                    await ctx.model.Menu.updateOne({_id: menu.parent}, {$pull: {subMenus: app.ObjectId(_id)}})
                }
            }
        }
        let createdMenu = await this.service.basic.save({
            model: ctx.model.Menu,
            fields: 'parent name icon data isTransparent',
        })
        if(!!parent){
            await ctx.model.Menu.updateOne({_id: parent}, {$addToSet: {subMenus: createdMenu._id}})
        }
        ctx.body = this.service.ret.success(await this.service.menu.getFullMenuByID(createdMenu._id))
    }

    async delete(ctx){
        await ctx.v({
            _id: 'objectID',
        })

        let { _id } = ctx.request.body
        let menu = await this.service.menu.getFullMenuByID(_id)
        if(menu){
            if(menu.parent){
                await ctx.model.Menu.updateOne({_id: menu.parent}, {$pull: {subMenus: _id}})
            }
            let ids = await this.service.menu.iterateMap([menu], m=>m._id)
            await ctx.model.Menu.deleteMany({_id: {$in: ids}})
        }
        ctx.body = this.service.ret.success()
    }

    async resetOrders(ctx){
        await ctx.v({
            orders: async (val, v)=>Array.isArray(val) &&
                val.every(item=>Array.isArray(item) && item.length === 2)
                && await Promise.all(val.map(async ([_id, order])=>{
                    return await v.v({ _id, order }, {
                        _id: 'objectID',
                        order: 'number',
                    })
                }))
        })

        let { orders } = ctx.request.body
        await Promise.all(orders.map(async ([_id, order])=>{
            await ctx.model.Menu.updateOne({_id}, {$set: { order }})
        }))
        ctx.body = this.service.ret.success()
    }

    // async setParent(ctx){
    //     await ctx.v({
    //         _id: 'objectID',
    //         parent: 'objectID$',
    //     })

    //     let { _id, parent } = ctx.request.body
    //     let menu = await ctx.model.Menu.findById(_id)
    //     if(!menu){
    //         throw new app.Error(0, '菜单不存在')
    //     }
    //     let originParent = menu.parent
    //     if(parent){
    //         let parentMenu = await ctx.model.Menu.findById(parent)
    //         if(!parentMenu){
    //             throw new app.Error(1, '父菜单不存在')
    //         }
    //         await ctx.model.Menu.updateOne({_id: parent}, {$addToSet: {subMenus: _id}})
    //     }else{
    //         await ctx.model.Menu.updateOne({_id: originParent}, {$pull: {subMenus: app.ObjectId(_id)}})
    //     }
    //     await ctx.model.Menu.updateOne({_id}, {$set: { parent }})
    //     ctx.body = this.service.ret.success()
    // }
}