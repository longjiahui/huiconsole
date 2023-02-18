<template>
    <a-modal
        okText="确定"
        cancelText="取消"
        :okButtonProps="{
            disabled: !validateState
        }"
        @ok="handleDone"
        width="250px"
        :mask-closable="maskClosable"
        @cancel="$emit('reject')">
        <template #title>
            <div class="v-m">
                <div class="title" style="font-size: .9em">{{title}}</div>
                <div v-if="desc" class="desc">{{desc}}</div>
            </div>
        </template>
        <!-- <div v-if="desc" class="v-m" style="padding: 16px">
            <div class="desc">
                {{desc}}
            </div>
            <a-input v-focus @keyup.enter="handleDone" v-model:value="value" :placeholder="placeholder" :type="type"></a-input>
        </div> -->
        <div class="h h-m input-wrapper">
            <input class="input" v-focus @keypress.enter="handleDone" v-model="value" :placeholder="placeholder" :type="type">
            <a-tooltip v-if="!validateState" :title="validateDescription">
                <transition appear name="fade-tr">
                    <div class="clickable error-flag"><ExclamationCircleOutlined /></div>
                </transition>
            </a-tooltip>
        </div>
    </a-modal>
</template>
<script>
import { computed, ref, toRefs } from 'vue'
export default {
    props: {
        title: {
            type: String,
            default: '输入'
        },
        type: {
            type: String,
            default: 'text'
        },
        // 默认的输入内容
        content: String,
        placeholder: String,
        // 点击背后的背景是否可以关闭modal
        maskClosable: {
            type: Boolean,
            default: true,
        },
        validates: {
            type: Array,
            default: ()=>[['.*', '输入内容错误']]
        },
        desc: String,
    },
    setup(props, context){
        let value = ref(props.content || '')

        let validateResult = computed(()=>{
            let ind = props.validates.map(validate=>{
                let rule = validate?.[0]
                if(rule instanceof Function){
                    return rule?.(value.value)
                }else if(rule instanceof RegExp){
                    return rule.test(value.value)
                }else if(typeof rule === 'string'){
                    return new RegExp(rule).test(value.value)
                }else{
                    return true
                }
            }).findIndex(s=>!s)
            return props.validates[ind]
        })
        let validateState = computed(()=>!validateResult.value)
        let validateDescription = computed(()=>validateResult.value?.[1])

        return {
            validateState,
            validateDescription,
            ...toRefs(props),
            value,
            handleDone(){
                if(validateState.value){
                    context.emit('r', value.value)
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.desc{
    color: #666;
    font-size: .8em;
}
.input-wrapper{
    padding: 8px 24px;
}
.input{
    width: 100%;
    // padding: 8px 24px;
    border: none;
    font-size: 1.1em;
    background: transparent;

    &:focus{
        outline: none;
    }
}

.error-flag{
    color: #ff7875;
}
</style>