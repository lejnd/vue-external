<!-- 单文件Vue混合组件示例 -->

<template>
<div class="yyn-editor">
    <div class="ye-btns">
        <button
        v-for="(item, index) in btnConfigs"
        :key="index"
        :title="item[2]"
        @click="bindBtnCommand(item)"
        >{{item[2]}}</button>
    </div>
    <div class="ye-editor" id="ye_editor" contenteditable>
    </div>
</div>
</template>

<script>
export default {
    name: 'YynEditor',
    props: {
        conf: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data(){
        let conf = this.conf;
        return {
            name: conf.name,
            btnConfigs: [
                ['bold', null, '字体加粗'],
                ['indent', null, '缩进'],
                ['InsertImage', '<img src="http://material-center-1254950508.file.myqcloud.com/cwvl1%E5%91%A8%E6%9C%AB%E5%8E%BB%E5%93%AA%E5%84%BF.gif#id=5c8726df93049b69324f61d9">', '图片']
            ]
        }
    },
    methods: {
        bindBtnCommand(item) {
            document.execCommand(item[0], false, item[1]);
        }
    }
}
</script>

<style lang="less">
.yyn-editor {
    .ye-editor {
        width: 100%;
        min-height: 200px;
        border: 1px solid #d4d4d4;
    }
}
</style>