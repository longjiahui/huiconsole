import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime';
import isLeapYear from 'dayjs/plugin/isLeapYear';
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
dayjs.extend(isLeapYear)

import { utils } from '@anfo/ui'

export default {
    ...utils,
    dayjs,

    getElementAttrRelatedToRoot(el, key){
        if(el.offsetElement){
            return el[key] + this.getElementAttrRelatedToRoot(el.offsetElement, key)
        }else{
            return el[key]
        }
    },
    getOffsetTop(el){
        return this.getElementAttrRelatedToRoot(el, 'offsetTop')
    },
    getClientTop(el){
        return this.getElementAttrRelatedToRoot(el, 'clientTop')
    },
    isPC: (()=>{
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
           "SymbianOS", "Windows Phone",
           "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
           if (userAgentInfo.indexOf(Agents[v]) > 0) {
              flag = false;
              break;
           }
        }
        return flag;
    })(),
    getStorage(type, key, defaultValue){
        let item = window[type].getItem(key)
        try{
            return typeof item === 'string' ? JSON.parse(item) : defaultValue
        }catch(err){
            console.warn('getStorage JSON parse error: ', err)
            return defaultValue
        }
    },
    setStorage(type, key, value){
        window[type].setItem(key, JSON.stringify(value))
    },
    getLocal(...rest){
        return this.getStorage('localStorage', ...rest)
    },
    setLocal(...rest){
        return this.setStorage('localStorage', ...rest)
    },

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
        let mapData = []
        await this.iterate(datas, childrenKey, async d=>{
            let ret = func(d)
            if(ret instanceof Promise){
                ret = await ret
            }
            mapData.push(ret)
        })
        return mapData
    },
    async iterateFilter(datas, childrenKey, func){
        let filterData = []
        await this.iterate(datas, childrenKey, async d=>{
            let ret = func(d)
            if(ret instanceof Promise){
                ret = await ret
            }
            if(ret){
                filterData.push(d)
            }
        })
        return filterData
    },

    setToken(token){
        this.setLocal('token', token)
    },
    getToken(){
        return this.getLocal('token', '')
    },

    limitKeys(obj, keys){
        return keys.reduce((t, key)=>{
            t[key] = obj[key]
            return t
        }, {})
    },

    isin(n, range){
        range = range.split(',')
        let [minData, maxData] = range
        let min = +(minData.slice(1))
        let ret = true
        if(minData[0] === '('){
            ret = n > min
        }
        if(ret && minData[1] === '['){
            ret = n >= min
        }
        let max = +(maxData.slice(0, -1))
        let maxType = maxData.slice(-1)
        if(ret && maxType === ')'){
            ret = n < max
        }
        if(ret && maxType === ']'){
            ret = n <= max
        }
        return ret
    }
}