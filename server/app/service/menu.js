const utils = require('../lib/utils')

const maxSubLevel = 10

const _genSubMenusLookupOption = (pipeline = [], i = 0)=>{
    return {
        $lookup: {
            from: 'menus',
            localField: 'subMenus',
            foreignField: '_id',
            as: 'subMenus',
            ...(i === maxSubLevel ? {} : {pipeline: [...pipeline, _genSubMenusLookupOption(pipeline, ++i)]}),
        }
    }
}

module.exports = app => class extends app.Service {
    createSubMenusLookupOption(pipeline = []){
        let lookupPipeline = []
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
        return utils.iterate(menus, 'subMenus', cb)
    }
    iterateMap(menus, cb){
        return utils.iterateMap(menus, 'subMenus', cb)
    }
}