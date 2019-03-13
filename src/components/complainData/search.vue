<template>
<div class="search-bar">
    <h2 class="title">{{title}}</h2>
    <el-form>
        <el-form-item label-width="0">
            <date-range></date-range>
        </el-form-item>
        <el-form-item label-width="0">
            <el-select v-model="value" placeholder="州市">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="value" placeholder="区县">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" plain @click="onSubmit" style="margin-left:20px">清空</el-button>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <div style="float:right">
                <el-button type="primary" @click="onSubmit">导出</el-button>
                <el-button type="primary" @click="onSubmit">打印</el-button>
            </div>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import DateRange from '../daterange/index.vue'
export default {
    name: 'SearchBar',
    components: { DateRange },
    props: {
        conf: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data() {
        let conf = this.conf
        return {
            title: conf.title || '数据可视化',
            options: [{
                value: '选项1',
                label: '黄金糕'
                }, {
                value: '选项2',
                label: '双皮奶'
                }, {
                value: '选项3',
                label: '蚵仔煎'
                }, {
                value: '选项4',
                label: '龙须面'
                }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            value: ''
        }
    },
    methods: {
        onSubmit() {
            console.log(111);
            
        }
    }
}
</script>

<style lang="less">
    .search-bar {
        .title {
            font-size: 16px;
            height: 20px;
            line-height: 20px;
            font-weight: 500;
            color: #444;
        }
    }
</style>