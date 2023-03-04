const compose = require('koa-compose')

module.exports = app=>{
    const { router, middleware, controller } = app
    let jwtQuiet = middleware.jwt('user', true)
    let jwt = compose([middleware.jwt('user'), async (ctx, next)=>{
        // 验证用户信息
        await next()
    }])

    let jwtAdminRoleCheck = compose([jwt, async (ctx, next)=>{
        let user = ctx.state.user
        if(user.role?.isAdmin){
            await next()
        }else{
            throw new app.ServiceError(100, '无权限')
        }
    }])

    router.post('/api/user/registerAdmin', controller.user.registerAdmin)
    router.post('/api/user/isAdminRegistered', controller.user.isAdminRegistered)
    router.post('/api/user/login', controller.user.login)
    router.post('/api/user/decode', controller.user.decode)
    router.post('/api/user/myInfo', jwt, controller.user.myInfo)
    router.post('/api/user/getChangingPasswordToken', jwt, controller.user.getChangingPasswordToken)
    router.post('/api/user/changePasswordByToken', jwt, controller.user.changePasswordByToken)
    router.post('/api/user/pageData', jwtAdminRoleCheck, controller.user.pageData)
    router.post('/api/user/save', jwtAdminRoleCheck, controller.user.save)
    router.post('/api/user/delete', jwtAdminRoleCheck, controller.user.delete)
    router.post('/api/user/changePassword', jwtAdminRoleCheck, controller.user.changePassword)

    router.post('/api/menu/all', jwt, controller.menu.all)
    router.post('/api/menu/save', jwtAdminRoleCheck, controller.menu.save)
    router.post('/api/menu/delete', jwtAdminRoleCheck, controller.menu.delete)
    router.post('/api/menu/resetOrders', jwtAdminRoleCheck, controller.menu.resetOrders)

    router.post('/api/role/dict', jwt, controller.role.dict)
    router.post('/api/role/pageData', jwt, controller.role.pageData)
    router.post('/api/role/save', jwtAdminRoleCheck, controller.role.save)
    router.post('/api/role/delete', jwtAdminRoleCheck, controller.role.delete)

    router.post('/api/asset/save', jwtAdminRoleCheck, controller.asset.save)
    router.post('/api/asset/delete', jwtAdminRoleCheck, controller.asset.delete)
    router.post('/api/asset/pageData', jwtAdminRoleCheck, controller.asset.pageData)

    router.post('/api/admin/save', jwtAdminRoleCheck, controller.admin.save)
    router.post('/api/admin/get', jwtAdminRoleCheck, controller.admin.get)
    router.post('/api/admin/pageData', jwtAdminRoleCheck, controller.admin.pageData)
    router.post('/api/admin/delete', jwtAdminRoleCheck, controller.admin.delete)
    // router.post('/api/admin/login', controller.user.login)
}