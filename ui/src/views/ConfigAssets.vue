<template>
    <div class="v-m size-full">
        <div class="card p-m v-m">
            <h3 class="m-0">添加资源</h3>
            <div>支持添加script/style资源，通常为资源URL。可以在菜单项设置中添加需要预先加载的资源。</div>
        </div>
        <div class="card p-m">
            <button class="button primary" @click="handleNew">新增</button>
        </div>
        <div class="card p-m" v-if="context.data?.length > 0">
            <Pagination></Pagination>
        </div>
        <div class="card">
            <List #="{ data }" no-data-text="暂时没有数据哦">
                <div class="vbox-0">
                    <div class="c1f-1 c2f-1 c3f-4 c0f-1 ctitle hbox-0 align-stretch cp-h-m cp-v-m" style="background: whitesmoke">
                        <div>资源名称</div>
                        <div>资源类型</div>
                        <div>资源链接</div>
                        <div>操作</div>
                    </div>
                    <div v-for="(item , i) in data">
                        <div class="c1f-1 c2f-1 c3f-4 c0f-1 clickable cv cjustify-center c0align-flex-start hbox-0 align-stretch cp-s cp-h-m" @click="handleEdit(item, i)">
                            <div>{{ item.name }}</div>
                            <div>{{ {
                                script: 'script',
                                style: 'stylesheet'
                            }[item.type] }}</div>
                            <div>{{ item.url }}</div>
                            <div @click.stop>
                                <a-popconfirm
                                    v-if="$getters.myID !== item._id"
                                    title="确定删除吗？"
                                    @confirm="handleDelete(item, i)">
                                    <button class="button error">
                                        <DeleteOutlined />
                                    </button>
                                </a-popconfirm>
                            </div>
                        </div>
                    </div>
                </div>
            </List>
        </div>
    </div>
</template>

<script setup>
import { usePagination } from '@anfo/ui'
import { api } from '@/scripts/api'
import dialog from '@/scripts/dialog'
import { onMounted } from 'vue';

const { List, Pagination, context } = usePagination(api.asset.pageData)

function handleNew(){
    dialog.openAssetSaveDialog().then(()=>context.refresh())
}
function handleEdit(asset){
    dialog.openAssetSaveDialog({asset}).then(data=>{
        Object.assign(asset, data)
    })
}
function handleDelete(asset, i){
    api.asset.delete({_id: asset._id}).then(()=>{
        context.refresh()
    })
}
</script>