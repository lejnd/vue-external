<template>
    <div class="home">
        <!-- <iframe id="iframe1" width="100%" height="3000" frameborder=0
            src="http://192.168.3.139:8088/test">
        </iframe> -->
        <!-- <yyn-editor></yyn-editor> -->
        <div class="header">组件库</div>
        <div class="row">
            <router-link to="table_modal">弹窗->表格操作</router-link>
        </div>
        <div class="row">
            <router-link to="map">腾讯地图组件</router-link>
        </div>
        <div class="row">
            <router-link to="form">表单组件：富文本编辑器</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    components: {  },
    data() {
        return {
            
        }
    }
}
</script>

<style lang="less">
    .home {
        font-size: 14px;
        .header {
            padding: 10px;
            text-align: center;
            background-color: aliceblue;
        }
        .row {
            margin: 15px;
            color: aqua;
            text-align: center;
        }
    }
</style>