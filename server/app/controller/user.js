const adminUserName = 'admin'

module.exports = app=>class extends app.Controller{

    // 是否初次打开系统
    async isAdminRegistered(ctx){
        ctx.body = this.service.ret.success(!!await ctx.model.User.findOne({ username: adminUserName }))
    }

    async registerAdmin(ctx){
        await ctx.v({
            password: 'truthystring',
        })
        let { password } = ctx.request.body
        let u = await ctx.model.User.findOne({ username: adminUserName })
        if(u){
            throw new app.Error(0, 'Admin account is registered !')
        }else{
            u = await ctx.model.User.create({
                username: adminUserName,
                password,
            })
        }
        let token = app.userJWTSign(u.toObject())
        this.service.user.setUserTokenAsCookie(token)
        ctx.body = this.service.ret.success(token)
    }

    async login(ctx){
        await ctx.v({
            username: 'truthystring',
            password: 'truthystring',
        })

        let { username, password } = ctx.request.body
        let u = await ctx.model.User.findOne({ username, password }, '-password')
        if(!u){
            throw new app.Error(0, '用户名或密码错误')
        }
        const token = app.userJWTSign(u.toObject())
        this.service.user.setUserTokenAsCookie(token)
        ctx.body = this.service.ret.success(token)
    }

    async myInfo(ctx){
        let user = ctx.state.user
        ctx.body = this.service.ret.success(await ctx.model.User.findOne({ _id: user._id }))
    }

    async decode(ctx){
        await ctx.v({
            token: 'truthystring',
        })
        let { token } = ctx.request.body
        ctx.body = this.service.ret.success(app.userJWTVerify(token))
    }

    async pageData(ctx){
        ctx.body = await this.service.ret.pageData({
            model: ctx.model.User,
            projection: '-password',
        })
    }
}