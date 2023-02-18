<template>
    <a-modal width="400px"
        title="修改角色"
        @cancel="emit('reject')"
        @ok="handleSave">
        <div class="p-l">
            <anfo-list-pagination :context="context" #="{ item }" container-class="vbox-s">
                <div class="h h-s">
                    <div class="v-xs f-1">
                        <div class="h h-s">
                            <UserOutlined />
                            <div>
                                {{item.username}} 
                            </div>
                        </div>
                        <div v-if="item.name">{{ item.name }}</div>
                    </div>
                    
                    <a-select :disabled="$getters.myID === item._id"
                        @update:value="val=>modifyList[item._id] = val"
                        :value="modifyList[item._id] || item.role._id"
                        style="width: 192px;text-align: right"
                        :options="roles.map(r=>({ label: `${r.key}${r.name ? `(${r.name})` : ''}`, value: r._id}))">
                    </a-select>
                </div>
            </anfo-list-pagination>
        </div>
    </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/scripts/api'
import { useList } from '@anfo/ui'
import { UserOutlined } from '@ant-design/icons-vue';

let list = useList()

let props = defineProps({
    role: String,
})
let emit = defineEmits(['reject', 'r'])
let context = list.pagination.createContext({
    api: api.user.pageData,
    condition: {
        role: props.role,
    }
})
context.refreshDatas()

let roles = ref([])

let modifyList = ref({})

api.role.dict().then(data=>{
    roles.value = data
})

function handleSave(){
    Promise.all(Object.keys(modifyList.value)?.map?.(userID=>{
        return api.user.save({ _id: userID, role: modifyList.value[userID] })
    }) || []).then(()=>{
        emit('r')
    })
}
</script>