import $const from '@/const'

export default {
    isURL(data){
        return /^http(s)?:\/\/.*/.test(data)
    },
    getMenuType(menu){
        if(/^https?:\/\/.+/.test(menu?.data?.data)){
            return $const.MT.IFRAME
        }else{
            return $const.MT.COMPONENT
        }
    }
}