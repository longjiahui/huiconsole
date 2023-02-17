<template>
    <a-modal width="300px"
        @cancel="$emit('reject')"
        :footer="null"
        :closable="false">
        <div class="p-h-l p-t-m">
            <a-input v-model:value="keywords" placeholder="DeleteOutlined"></a-input>
        </div>
        <div class="p-l icon-container overflow-auto">
            <div @click="$emit('r', icon)" v-for="icon in finalIcons" class="icon-item h justify-center clickable">
                <component :is="icon"></component>
            </div>
        </div>
    </a-modal>
</template>
<script setup>
import { ref, computed } from 'vue'
import utils from '@/scripts/utils'
import extend from 'extend'

import * as _icons from '@ant-design/icons-vue'

// let props = defineProps({
//     value: String,
// })
let keywords = ref('')
let icons = ref(Object.keys(_icons).filter(i=>!['default', 'setTwoToneColor', 'getTwoToneColor', 'createFromIconfontCN'].includes(i)))
let finalIcons = computed(()=>{
    let regexp = new RegExp(`.*${keywords.value.toLowerCase()}.*`)
    return icons.value.filter(i=>regexp.test(i.toLowerCase()))
})

let emit = defineEmits(['reject', 'r'])
</script>

<style lang="scss" scoped>
.icon-container{
    max-height: 400px;
    $gap: 16px;
    display: grid;
    gap: $gap;

    @mixin grid-template-columns($n){
        grid-template-columns: repeat($n, calc((100% - $gap * ($n - 1))/ $n));
    }
    @include grid-template-columns(8);
    .icon-item{
        font-size: 1.5em;
    }
    // @media screen and (max-width: 1910px) {
    //     @include grid-template-columns(3);
    // }
    // @media screen and (max-width: 1400px) {
    //     @include grid-template-columns(2);
    // }
    // @media screen and (max-width: 1065px) {
    //     @include grid-template-columns(1);
    // }
}

</style>