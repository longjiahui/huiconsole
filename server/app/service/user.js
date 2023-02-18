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

    getFullUsers(query, withPassword = false){
        return this.ctx.model.User.find(query, withPassword ? undefined : '-password').populate('role').then(datas=>datas?.map?.(d=>d.toObject()))
    }
    getFullUserByID(user, ...rest){
        return this.getFullUsers({ _id: user }, ...rest).then(users=>users?.[0])
    }
    getFullUserByIDWithPassword(user){
        return this.getFullUserByID(user, true)
    }
    getFullUser(query, ...rest){
        return this.getFullUsers(query, ...rest).then(users=>users?.[0])
    }
    getFullUserWithPassword(query){
        return this.getFullUser(query, true)
    }
}