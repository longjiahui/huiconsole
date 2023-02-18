<template>
<a-modal width="400px" title="菜单权限配置" @cancel="emit('reject')" @ok="handleSave">
    <div class="p-l">
        <anfo-tree v-if="_id && lMenus?.length > 0" :datas="lMenus" #="{ hasChildren, item, datas, i }" data-key="_id" children-key="subMenus">
            <div @click="handleCheck(item, !checkDatas[item._id])" class="f-1 h h-s p-v-xs menu-item clickable">
                <a-checkbox
                    @update:checked="val=>handleCheck(item, val)"
                    :checked="checkDatas[item._id]"
                    :indeterminate="!checkDatas[item._id] && indeterminates[item._id]"></a-checkbox>
                <component v-if="item.icon" :is="item.icon"></component>
                <div>{{ item.name }}</div>
                <div class="desc">{{ item.data }}</div>
            </div>
        </anfo-tree>
        <div v-else-if="_id" class="desc">暂时没有菜单数据</div>
        <div v-if="!_id">参数不完整，_id为空</div>
    </div>
</a-modal>
</template>

<script setup>
import api from '@/scripts/api'
import { ref, computed } from 'vue'
import utils from '@/scripts/utils'

let props = defineProps({
    // roleID
    _id: String,
    menus: {
        type: Array,
        default: ()=>([])
    },
})
let emit = defineEmits(['reject', 'r'])

let lMenus = ref([])
api.menu.pageData().then(({data: menus, total})=>{
    lMenus.value = menus
})

/*
    思路
    indeterminates 表示是否有子菜单被选中且不是全部选中
    checkDatas 表示是否被选中

    有子菜单的indeterminates和checkDatas都是计算属性，他们的值都依赖自己子组件的数据
    没有子菜单的indeterminates和checkDatas都是普通属性，他们的值需要可以被设置
*/

let checkDatas = utils.createAsyncComputed(lMenus, async val=>{
    let menus = lMenus.value
    let datas = {}
    await utils.iterate(menus, 'subMenus', m=>{
        if(m.subMenus?.length > 0){
            datas[m._id] = computed(()=>{
                return m.subMenus.every(sm=>checkDatas.value[sm._id])
            })
        }else{
            datas[m._id] = props.menus?.includes?.(m._id) || false 
        }
    })
    return datas
})

let indeterminates = utils.createAsyncComputed(lMenus, async ()=>{
    let menus = lMenus.value
    let datas = {}
    await utils.iterate(menus, 'subMenus', m=>{
        if(m.subMenus?.length > 0){
            datas[m._id] = computed(()=>{
                return utils.isin(m.subMenus.filter(sm=>!!indeterminates.value[sm._id] || checkDatas.value[sm._id])?.length, `(0, ${m.subMenus.length}]`)
            })
        }
    })
    return datas
})

async function handleCheck(m, isChecked){
    if(m.subMenus?.length > 0){
        await utils.iterate(m.subMenus, 'subMenus', sm=>{
            if(!(sm.subMenus?.length > 0)){
                checkDatas.value[sm._id] = isChecked
            }
        })
    }else{
        checkDatas.value[m._id] = isChecked
    }
}

async function handleSave(){
    let roleID = props._id
    let menuIDs = (await utils.iterateFilter(lMenus.value, 'subMenus', m=>{
        return !!indeterminates.value[m._id] || !!checkDatas.value[m._id]
    })).map(m=>m._id)
    emit('r', menuIDs)
}
</script>

<style lang="scss" scoped>
.menu-item{
    // .menu-tool{
    //     transition: transform .3s, opacity .3s;
    //     opacity: 0;
    //     transform: translate(-8px, 0);
    // }

    // &:hover{
    //     .menu-tool{
    //         opacity: 1;
    //         transform: none;
    //     }
    // }
}
</style>