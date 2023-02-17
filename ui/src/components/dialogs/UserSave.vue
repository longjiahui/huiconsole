<template>
    <a-modal
        :title="title"
        @cancel="emit('reject')"
        width="300px">
        <div class="p-l v-m">
            <div>
                <a-input placeholder="username"></a-input>
            </div>
            <div>
                <a-input placeholder="nickname ( optional )"></a-input>
            </div>
            <div>
                <a-input placeholder="init password"></a-input>
            </div>
        </div>
    </a-modal>
</template>

<script setup>
import { computed } from 'vue'

let props = defineProps({
    user: {
        type: Object,
        default: ()=>({}),
    }
})

let emit = defineEmits(['r', 'reject'])
let isEdit = computed(()=>props.user?._id)
let title = computed(()=>{
    return isEdit ? '编辑用户' : '新建用户'
})
</script>