const errorType = require('../lib/errorType')

module.exports = ()=>async (ctx, next)=>{
    try{
        await next()
    }catch(err){
        //将参数也记录下来
        if(err instanceof errorType.ValidateError){
            ctx.body = ctx.service.ret.error(201, '参数错误')
            ctx.logger.info(`参数错误`)
        }else if(err instanceof errorType.LoginCheckError){
            ctx.body = ctx.service.ret.error(206, '登陆失败')
        }else if(err instanceof errorType.Error || err instanceof errorType.ServiceError){
            ctx.logger.warn(err)
            ctx.body = ctx.service.ret.error(err.no, err.msg)
        }else{
            ctx.logger.error(err)
            // 下面的错误通知飞书机器人
            // ctx.service.feishu.error(`服务器错误(${err.name})`, err.stack.slice(0, 512) || err.msg || err.message)
            if(err.name === 'MongoError' && +err.code === 11000){
                ctx.body = ctx.service.ret.error(204, '数据重复')
            }else if(err.name === 'CastError' && err.path === '_id'){
                ctx.body = ctx.service.ret.error(205, 'id格式错误')
            }else{
                ctx.body = ctx.service.ret.error(250, '未预知的错误，请联系管理员')
            }
        }
    }
}