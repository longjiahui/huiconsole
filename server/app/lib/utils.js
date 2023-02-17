module.exports = {
    async iterate(datas, childrenKey, func, parent = null){
        if(func instanceof Function){
            for(let i = 0; i < datas.length; ++i){
                let d = datas[i]
                let ret = await func(d, i, datas, parent)
                if(ret !== undefined){
                    return ret
                }else{
                    if(d[childrenKey] instanceof Array){
                        ret = await this.iterate(d[childrenKey], childrenKey, func, d)
                        if(ret !== undefined){
                            return ret
                        }
                    }
                }
            }
        }
    },
    async iterateMap(datas, childrenKey, func){
        let ret = []
        await this.iterate(datas, childrenKey, d=>{
            ret.push(func(d))
        })
        return ret
    },
}