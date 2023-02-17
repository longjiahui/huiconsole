import transportUtils from './transport'
import Emitter from './emitter'
import shortid from 'shortid'

const setChannelCommand = '_channel'

export default class extends Emitter{
    constructor({
        to,
        channel,
        debug = false,
        commandTimeout = 15000,
    } = {}){
        super()
        this._debug = debug
        this._channel = channel
        this.commandTimeout = commandTimeout
        this._toWindow = to
        this.on(setChannelCommand, c=>{
            this._channel = c
        })
        window.addEventListener('message', e=>{
            this.debug('received: ', e.data)
            let data
            try{
                data = JSON.parse(e.data)
            }catch(err){
                console.debug('parse window postmessage error', err)
            }
            if(data?.command && data.channel == this._channel){
                this.emit(data.command, ...(data.data || [])).then(ret=>{
                    this.debug('message handled: ', ret)
                    if(data.replyId){
                        return this.reply(data.replyId, ret)
                    }
                })
            }
        })
    }

    to(toWindow){
        this._toWindow = toWindow
        this._rToWindow?.()
    }
    async channel(c){
        let ret = this.command(setChannelCommand, c)
        this._channel = c
        await ret
    }

    async _send(data){
        data.channel = this._channel
        data = await transportUtils.serialize(data)
        this.debug(`sending: `, data)
        if(!this._toWindow){
            console.warn('toWindow is empty ! start awaiting !')
            await new Promise((r, reject)=>{
                this._rToWindow = r
            })
            console.debug('await over: ', this._toWindow)
        }
        this._toWindow.postMessage(JSON.stringify(data), '*')
    }

    // 只返回一个参数data，而不是...rest 因为promise resolve只能是一个参数
    async reply(replyId, data){
        return this._send({
            command: replyId,
            data: [data]
        })
    }

    async command(command, ...rest){
        let promise = new Promise(async (r, reject)=>{
            // 此id用来绑定 返回的消息是属于该发送的返回
            let replyId = shortid.generate()
            this.once(replyId, r)
            await this._send({
                replyId,
                command,
                data: rest,
            })
            setTimeout(()=>{
                promise.catch(err=>{
                    console.warn(err)
                })
                let errInfo = `[${Date.now()}]command(${command}) request timeout: ${this.commandTimeout}ms`
                reject(errInfo)
            }, this.commandTimeout)
        })
        return promise
    }

    debug(...rest){
        if(this._debug){
            return console.warn(...rest)
        }
    }
}
