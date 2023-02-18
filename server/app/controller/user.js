const adminUserName = 'admin'

module.exports = app=>class extends app.Controller{

    // 是否初次打开系统
    async isAdminRegistered(ctx){
        ctx.body = this.service.ret.success(!!await ctx.model.User.findOne({ username: adminUserName }))
    }

    async registerAdmin(ctx){
        await ctx.v({
            password: 'truthyString',
        })
        let { password } = ctx.request.body
        let u = await ctx.model.User.findOne({ username: adminUserName })
        if(u){
            throw new app.Error(0, 'Admin account is registered !')
        }else{
            let adminRole = await ctx.model.Role.create({
                username: 'admin',
                key: 'admin',
                name: '系统管理员',
                description: '系统初始管理员，最大权限拥有者。',
                isAdmin: true,
            })
            u = await ctx.model.User.create({
                username: adminUserName,
                password,
                role: adminRole._id,
            })
        }
        let token = app.userJWTSign(await this.service.ret.user.getFullUserByID(u._id))
        this.service.user.setUserTokenAsCookie(token)
        ctx.body = this.service.ret.success(token)
    }

    async login(ctx){
        await ctx.v({
            username: 'truthyString',
            password: 'truthyString',
        })

        let { username, password } = ctx.request.body
        let u = await this.service.user.getFullUser({ username, password })
        if(!u){
            throw new app.Error(0, '用户名或密码错误')
        }
        const token = app.userJWTSign(u.toObject())
        this.service.user.setUserTokenAsCookie(token)
        ctx.body = this.service.ret.success(token)
    }

    async myInfo(ctx){
        let user = ctx.state.user
        ctx.body = this.service.ret.success(await this.service.user.getFullUserByID(user._id))
    }

    async decode(ctx){
        await ctx.v({
            token: 'truthyString',
        })
        let { token } = ctx.request.body
        let user = app.userJWTVerify(token)
        if(!user?._id){
            throw new app.Error(0, 'token内容不完整')
        }
        let newestUser = await this.service.ret.user.getFullUserByID(user._id)
        if(!newestUser){
            throw new app.Error(1, '用户不存在')
        }
        ctx.body = this.service.ret.success(newestUser)
    }

    async pageData(ctx){

        await ctx.v({
            keyword$: 'string$',
        })

        let { keyword } = ctx.request.body
        let condition = {}
        if(keyword){
            if(!condition.$or){
                condition.$or = []
            }
            let keywordRegExp = new RegExp(`.*${keyword}.*`)
            ;['name', 'username'].forEach(k=>{
                condition.$or.push({[k]: keywordRegExp})
            })
        }
        ctx.body = await this.service.ret.pageData({
            model: ctx.model.User,
            condition,
            queryHandler: q=>q.populate('role').sort({ 'role.isAdmin': 1, createdAt: 1, }),
            projection: '-password',
        })
    }

    async save(ctx){
        await ctx.v({
            _id$: 'objectID',
            username$: 'truthyString',
            name$: 'string$',
            password$: 'truthyString',
            role$: 'objectID',
            description$: 'truthyString$',
        })

        let { _id, username, name, password, role, description } = ctx.request.body

        // check role exists
        let r = await ctx.model.Role.findById(role)
        if(!r){
            throw new app.Error(0, '角色不存在')
        }
        let u = await this.service.basic.save({
            model: ctx.model.User,
            fields: '_id username name password role avatar description',
            projection: '-password',
        })
        u.role = r
        ctx.body = this.service.ret.success(u)
    }

    // 非管理员账号使用
    async getChangingPasswordToken(ctx){
        await ctx.v({
            password: 'truthyString',
        })
        let me = ctx.state.user
        let { password } = ctx.request.body
        let myID = me?._id
        if(!myID){
            throw new app.Error(0, 'token信息不完整')
        }
        if(!await ctx.model.User.findOne({ _id: myID, password })){
            throw new app.Error(1, '密码错误')
        }
        ctx.body = this.service.ret.success(app.passwordChangingJWTSign({ _id, password }))
    }

    // 非管理员账号使用
    async changePasswordByToken(ctx){
        await ctx.v({
            token: 'truthyString',
        })
        let me = ctx.state.user
        let myID = me?._id
        if(!myID){
            throw new app.Error(0, 'token信息不完整')
        }
        let { token } = ctx.request.body
        let { _id, password: toPassword } = app.passwordChangingJWTVerify(token) || {}
        if(myID !== _id){
            throw new app.Error(0, '不是自己的token')
        }
        if(!_id || !toPassword){
            throw new app.Error(1, 'token内容错误')
        }
        await ctx.model.User.updateOne({ _id }, { $set: { password: toPassword } })
        ctx.body = this.service.ret.success()
    }

    async changePassword(ctx){
        await ctx.v({
            _id: 'objectID',
            to: 'truthyString',
        })
        let { _id, to: toPassword } = ctx.request.body
        let me = ctx.state.user
        me = await this.service.user.getFullUserByID(me._id)
        if(!me){
            throw new app.Error(0, '我的信息不存在')
        }
        let user = await this.service.user.getFullUserByID(_id)
        if(!user){
            throw new app.Error(1, '用户不存在')
        }
        if(!me.role?.isAdmin){
            throw new app.Error(2, '没有权限')
        }
        await ctx.model.User.updateOne({ _id }, { $set: { password: toPassword }})
        ctx.body = this.service.ret.success()
    }

    async delete(ctx){
        await ctx.v({
            _id: 'objectID',
        })

        let { _id } = ctx.request.body

        let me = ctx.state.user
        if(_id === me?._id){
            throw new app.Error(0, '不能删除自己')
        }
        await ctx.model.User.deleteOne({ _id })
        ctx.body = this.service.ret.success()
    }
}