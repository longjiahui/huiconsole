module.exports = app => class extends app.Controller {
    async all(ctx){
        ctx.body = this.service.ret.success(await ctx.model.Role.find())
    }
}