<template>
    <div class="v-m">
        <div class="card p-m h-s">
            <button class="button primary" @click="handleNewMenu">新建菜单</button>
            <!-- <button class="button">导入</button>
            <button class="button">导出</button> -->
        </div>
        <div class="card p-m">
            <anfo-tree @change="handleChange" :datas="menus" :data-key="d=>d._id" children-key="subMenus">
                <template #="{ item, i, datas, hasChildren }">
                    <div @click="handleEditMenu(item, datas, i)" class="clickable f-1 menu-item h h-xs p-v-s">
                        <template v-if="item">
                            <div v-if="item.icon">
                                <component :is="item.icon" />
                            </div>
                            <div class="title">{{ item.name }}</div>
                            <div v-if="!hasChildren" class="desc">{{ item.data }}</div>
                            <div class="h h-xs menu-tools" @click.stop>
                                <PlusOutlined @click="handleNewSubMenu(item)" class="clickable" />
                                <!-- <EditOutlined @click="handleEditSubMenu(item, i)" class="clickable" /> -->
                                <a-popconfirm
                                    title="是否确认删除这个菜单"
                                    @confirm="handleDeleteMenu(item, datas, i)"
                                >
                                    <DeleteOutlined class="clickable" />
                                </a-popconfirm>
                            </div>
                        </template>
                    </div>
                </template>
            </anfo-tree>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import api from '@/scripts/api'
import utils from '@/scripts/utils'
import dialog from '@/scripts/dialog'
import { DeleteOutlined, FolderOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons-vue'

let menus = ref([])

api.menu.pageData().then(data=>{
    menus.value = data.data
})

function handleNewMenu(){
    dialog.openMenuSaveDialog().then(data=>{
        menus.value.unshift(data)
        // 顶层排序reset
        api.menu.resetOrders({
            orders: menus.value.map((item, i)=>[item._id, i])
        })
    })
}
function handleNewSubMenu(parent){
    dialog.openMenuSaveDialog({
        menu: { parent: parent._id },
    }).then(data=>{
        parent.subMenus.push(data)
        api.menu.resetOrders({
            orders: [[data._id, parent.subMenus.length]]
        })
    })
}
function handleEditMenu(menu, datas, i){
    dialog.openMenuSaveDialog({menu}).then(data=>{
        datas[i] = data
    })
}
function handleChange({ treeData, value, dropValue, index, parent } = {}){
    let orders = []
    if(dropValue){
        dropValue.subMenus.forEach((item, i)=>{
            orders.push([item._id, i])
        })
    }else{
        // dropValue不存在，修改顶层orders
        treeData.forEach((item, i)=>{
            orders.push([item._id, i])
        })
    }
    if(parent && parent._id !== dropValue?._id){
        parent.subMenus.forEach((item, i)=>{
            orders.push([item._id, i])
        })
    }
    api.menu.resetOrders({
        orders
    })
    api.menu.save({
        _id: value._id,
        parent: dropValue?._id || null,
    }).then(()=>{
        menus.value = treeData
    })
}

function handleDeleteMenu(menu, datas, i){
    // 不能用datas.splice(i, 1) 因为datas是组件中新生成的于menus是不同的引用
    api.menu.delete({
        _id: menu._id,
    }).then(()=>{
        return utils.iterate(menus.value, 'subMenus', (item, i, datas)=>{
            if(item._id === menu._id){
                datas.splice(i, 1)
                return true
            }
        })
    })
}
</script>

<style lang="scss" scoped>
.menu-item{
    .menu-tools{
        opacity: 0;
        transform: translate(-8px, 0);
        transition: opacity .3s, transform .3s;
    }
    &:hover{
        .menu-tools{
            transform: none;
            opacity: 1;
        }
    }
}
</style>