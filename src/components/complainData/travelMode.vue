<template>
<div class="travel-mode">
    <search-bar :conf="searchConf"></search-bar>
    <div class="content-box">
        <div class="flex1 pie_chart" id="pie_chart"></div>
        <div class="flex1">
            <el-table
            :data="tableData"
            border
            stripe
            show-summary
            style="width: 100%">
                <el-table-column
                v-for="(item, index) in tableItems"
                :key="index"
                :prop="item.data"
                :label="item.label"
                align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>
</div>
</template>

<script>
import $ from 'jquery'
import echarts from 'echarts'

import SearchBar from './search.vue'
export default {
    name: 'TravelMode',
    components: { SearchBar },
    props: {
        conf: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data() {
        let conf = this.conf;
        return {
            // conf
            searchConf: conf.searchConf || { title: '投诉人旅行方式' },
            // self
            tableItems: [{
                data: 'name',
                label: '投诉渠道'
            }, {
                data: 'ratio',
                label: '占比'
            }, {
                data: 'value',
                label: '投诉总量'
            }],
            tableData: [
                {value:335,  name:'团队', ratio: '60%'},
                {value:310,  name:'个人', ratio: '40%'}
            ]
        }
    },
    methods: {
        initChart() {
            let myChart = echarts.init(document.getElementById('pie_chart'));
            myChart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [
                    {
                        name:'投诉人旅行方式',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                formatter: '{b}（{d}%）',
                            },
                            emphasis: {
                                show: true,
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: this.tableData
                    }
                ]
            })
        }
    },
    mounted() {
        this.initChart()
    }
}
</script>

<style lang="less">
.travel-mode {
    .content-box {
        display: flex;
        align-items: center;
        .flex1 {
            flex: 1;
        }
        .pie_chart {
            min-height: 300px;
        }
    }
}
</style>