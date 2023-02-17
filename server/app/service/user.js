module.exports = app => class extends app.Service{
    setTokenAsCookie(key, token){
        this.ctx.cookies.set(key, token, {
            // maxAge 此处毫秒数
            maxAge: 90 * 24 * 3600 * 1000,
        })
    }

    setUserTokenAsCookie(token){
        return this.setTokenAsCookie('userToken', token)
    }
}