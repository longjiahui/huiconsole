// for websocket transport
const flag = '\ufff0'

const TYPE_BLOB = 'blob'
const TYPE_FORMDATA = 'formdata'

export default {
    isPackage(data){
        return !!data[flag]
    },
    async serializeFormData(data){
        let ret = []
        if(data.entries instanceof Function){
            let i = data.entries()
            let item = i.next()
            while(!item.done){
                ret.push(await this.serialize(item.value))
                item = i.next()
            }
            return ret
        }else{
            return []
        }
    },
    deserializeFormData(data = []){
        return data.reduce((t, [key, value] = [])=>{
            if(key){
                t.append(key, this.deserialize(value))
            }
            return t
        }, new FormData)
    },
    async blobToDataURL(blob){
        return new Promise((r, reject)=>{
            let reader = new FileReader()
            reader.onload = e=>r(e.target.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    },
    dataURLToBlob(dataURL){
        if(dataURL === 'data:'){
            return new Blob()
        }
        var arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    },
    makePackage(type, data){
        return {
            [flag]: type,
            data,
        }
    },
    async serialize(data){
        // 查找blob 转换成 base64
        if(data instanceof Array){
            await Promise.all(data.map(async (item , i)=>{
                data[i] = await this.serialize(item)
            }))
            return data
        }else if(data instanceof Blob){
            // 转换base64
            return this.makePackage(TYPE_BLOB, await this.blobToDataURL(data))
        }else if(data instanceof FormData){
            return this.makePackage(TYPE_FORMDATA, await this.serializeFormData(data))
        }else if(data && typeof data === 'object'){
            await Promise.all(Object.keys(data).map(async k=>{
                let v
                try{
                    // axios返回的内容有的读取会报错
                    v = data[k]
                    data[k] = v
                }catch(err){
                    console.warn(err)
                    return Promise.resolve()
                }
                data[k] = await this.serialize(data[k])
            }))
            return data
        }else{
            return data
        }
    },
    deserializePackage(data){
        let type = data[flag]
        switch(type){
            case TYPE_BLOB:
                return this.dataURLToBlob(data.data)
            case TYPE_FORMDATA:
                return this.deserializeFormData(data.data)
        }
    },
    deserialize(data){
        // 查找base64 转换成 blob
        if(data instanceof Array){
            data.forEach((item , i)=>{
                data[i] = this.deserialize(item)
            })
            return data
        }else if(data && typeof data === 'object'){
            if(this.isPackage(data)){
                data = this.deserializePackage(data)
            }else{
                Object.keys(data).forEach(k=>{
                    data[k] = this.deserialize(data[k])
                })
            }
            return data
        }else{
            return data
        }
    }
}