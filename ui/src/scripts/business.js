import $const from '@/const'

export default {
    getMenuType(menu){
        if(/^https?:\/\/.+/.test(menu?.data)){
            return $const.menuType.iframe
        }else{
            return $const.menuType.component
        }
    }
}