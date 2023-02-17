

module.exports = app=>({
    modelName(val){
        return Object.keys(app.model).map(m=>m.toLowerCase()).includes(val.toLowerCase())
    },

    //common
    objectID(val){
        return this.v(val, ['string', val=>this.v(val?.length, 24)])
    },
    dateString(val){
        return this.v(val, ['string', val=>!isNaN(new Date(val).getTime())])
    },
    futureDateString(val){
        return this.v(val, ['dateString', val=>new Date(val) >= new Date(new Date().toDateString())])  
    },
    

    //user
    email(val){
        return this.v(val, ['string', val=>/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val)])
    },
    password(val){
        return this.v(val, ['string', val=>val && val?.length >= 6])
    },
    username(val){
        return this.v(val, ['string', val=>this.v(val?.length, '>=1 && <=32')])
    },

    //group
    groupName(val){
        return this.v(val, ['string', val=>this.v(val?.length, '>0 && <=64')])
    },
    dayLimit(val){
        return this.v(val, ['number', '>=0 && <30'])
    },

    //groupmember
    memberRole(val){
        const consts = app.config.constValues
        let roles = Object.keys(consts).filter(c=>/^GMROLE_/.test(c)).map(k=>consts[k])
        return this.v(val, ['number', val=>roles.includes(val)])
    }
})