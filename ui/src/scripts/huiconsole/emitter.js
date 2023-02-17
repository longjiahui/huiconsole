const TYPE_ON = 'on'
const TYPE_ONCE = 'once'

const forAllChannel = 'forAll'

class Callback{

    constructor(type, callback){
        this.type = type
        this.callback = callback
        if(!(callback instanceof Function) || ![TYPE_ON, TYPE_ONCE].includes(type)){
            console.error(`construct Callback error: type(${type}) callback instanceof Function(${callback instanceof Function})`)
        }
    }

    call(...rest){
        return this.callback(...rest)
    }
}

class _Emitter {

    constructor(){
        this.callbacks = {}
    }

    _confirmCMDFunc(channel){
        if(!(this.callbacks[channel] instanceof Array)){
            this.callbacks[channel] = []
        }
    }
    off(channel, callback){
        let ind = this.callbacks[channel]?.findIndex?.(f=>f=== callback)
        if(ind > -1){
            this.callbacks[channel].splice(ind, 1)
        }
    }
    // id 用来获取返回
    on(channel, callback){
        this._confirmCMDFunc(channel)
        this.callbacks[channel].push(new Callback(TYPE_ON, callback))
    }
    once(channel, callback){
        this._confirmCMDFunc(channel)
        this.callbacks[channel].push(new Callback(TYPE_ONCE, callback))
    }
    async emit(channel, ...rest){
        if(this.callbacks[channel] && this.callbacks[channel].length > 0){
            let ret
            let callbacks = this.callbacks[channel]
            callbacks.forEach(callback=>{
                ret = callback.call(...rest)
            })
            // removeAll Once Func
            this.callbacks[channel] = callbacks.filter(c=>c.type !== TYPE_ONCE)

            if(ret instanceof Promise){
                return await ret
            }else if(ret){
                return ret
            }
        }
    }
}

class Emitter extends _Emitter{

    constructor(...rest){
        super(...rest)
        // 用来监听所有的事件emit
        this.forAll = new _Emitter()
    }
    onAll(callback){
        this.forAll.on(forAllChannel, callback)
    }
    onceAll(callback){
        this.forAll.once(forAllChannel, callback)
    }
    emit(channel, ...rest){
        this.forAll.emit(forAllChannel, channel, ...rest)
        return super.emit(channel, ...rest)
    }
}

export default Emitter