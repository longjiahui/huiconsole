const utils = require('../lib/utils')

const maxSubLevel = 10

const _genSubMenusLookupOption = (pipeline = [], i = 0)=>{
    return {
        $lookup: {
            from: 'menus',
            localField: 'children',
            foreignField: '_id',
            as: 'children',
            ...(i === maxSubLevel ? {} : {pipeline: [...pipeline, _genSubMenusLookupOption(pipeline, ++i)]}),
        }
    }
}

module.exports = app => class extends app.Service {
    createSubMenusLookupOption(pipeline = []){
        let lookupPipeline = [{
            $lookup: {
                from: 'assets',
                localField: 'data.preloadAssets',
                foreignField: '_id',
                as: 'data.preloadAssets',
            }
        }]
        return [...lookupPipeline, _genSubMenusLookupOption([...pipeline, ...lookupPipeline])]
    }

    async getFullMenus(condition){
        return await this.ctx.model.Menu.aggregate([{
            $match: condition,
        }, ...this.createSubMenusLookupOption()])
    }

    async getFullMenuByID(id){
        return (await this.getFullMenus({_id: app.ObjectId(id)}))?.[0]
    }

    iterate(menus, cb){
        return utils.iterate(menus, 'children', cb)
    }
    iterateMap(menus, cb){
        return utils.iterateMap(menus, 'children', cb)
    }

    async myAll(){
        let ctx = this.ctx
        let user = ctx.state.user
        let newestUser = await this.service.user.getFullUserByID(user._id)
        let condition = {}
        if(!newestUser?.role?.isAdmin){
            condition = { _id: {$in: newestUser?.role?.menus || []}}
        }
        let menus = (await ctx.model.Menu.find(condition).populate('parent').populate({
            path: 'data.preloadAssets',
            model: ctx.model.Asset,
        })).map(m=>m.toObject())
        return ctx.helper.buildTree(menus)
    }
}