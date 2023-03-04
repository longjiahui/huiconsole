module.exports = {
    async withTransaction(func){

        return func()

        // let session = await this.app.mongoose.startSession()
        // let ret
        // await session.withTransaction(async ()=>{
        //     if(func instanceof Function){
        //         ret = await func(session)
        //     }
        // })
        // await session.endSession()
        // return ret
    }
}