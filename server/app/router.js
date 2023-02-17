module.exports = app=>{
    const { router, middleware, controller } = app
    let jwtQuiet = middleware.jwt('user', true)
    let jwt = middleware.jwt('user')

    router.post('/api/user/registerAdmin', controller.user.registerAdmin)
    router.post('/api/user/isAdminRegistered', controller.user.isAdminRegistered)
    router.post('/api/user/login', controller.user.login)
    router.post('/api/user/myInfo', jwt, controller.user.myInfo)
    router.post('/api/user/decode', jwt, controller.user.decode)
    router.post('/api/user/pageData', jwt, controller.user.pageData)

    router.post('/api/menu/pageData', jwt, controller.menu.pageData)
    router.post('/api/menu/save', jwt, controller.menu.save)
    router.post('/api/menu/delete', jwt, controller.menu.delete)
    router.post('/api/menu/resetOrders', jwt, controller.menu.resetOrders)

    router.post('/api/admin/save', jwt, controller.admin.save)
    router.post('/api/admin/get', jwt, controller.admin.get)
    router.post('/api/admin/pageData', jwt, controller.admin.pageData)
    router.post('/api/admin/delete', jwt, controller.admin.delete)
    router.post('/api/admin/login', controller.user.login)
}