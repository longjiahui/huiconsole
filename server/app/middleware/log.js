module.exports = ()=>(async (ctx, next)=>{
    ctx.logger.info()
    let paramsString = ctx.getParamsString()
    if(!paramsString){
        paramsString = 'no params'
    }
    ctx.logger.info(`${ctx.request.method}-${ctx.request.url}: ${paramsString}`)
    await next()
})