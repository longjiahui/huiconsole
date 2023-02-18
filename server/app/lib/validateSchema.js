

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
})