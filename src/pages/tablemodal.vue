<template>
    <div class="test">
        <div class="box"></div>

        <vue-table-modal></vue-table-modal>
        <vue-table-modal></vue-table-modal>

    </div>
</template>

<script>
import VueTableModal from 'components/tableModal/index.vue'    
export default {
    name: '',
    components: { VueTableModal },
    data() {
        return {
            
        }
    }
}
</script>

<style lang="less">
    .test {
        .box {
            height: 600px;
            background-color:antiquewhite;
        }
    }
</style>