<template>
    <div class="trend-data">
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label-width="0px">
                <el-date-picker
                v-model="dateValue"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
                @change="reloading()">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="渠道：">
                <el-select v-model="channel" placeholder="渠道" @change="reloading()">
                    <el-option
                    v-if="channelList"
                    v-for="(channel, index) in channelList"
                    :key="index"
                    :label="channel.content"
                    :value="channel.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="版本：">
                <el-select v-model="version" placeholder="版本" @change="reloading()">
                    <el-option
                    v-if="versionList"
                    v-for="(version, index) in versionList"
                    :key="index"
                    :label="version.content"
                    :value="version.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="系统：">
                <el-select v-model="system" placeholder="系统" @change="reloading()">
                    <el-option
                    v-for="(system, index) in systemList"
                    :key="index"
                    :label="system.content"
                    :value="system.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="data-radio">
            <el-radio-group v-model="crux" @change="reloading()">
                <el-radio-button
                v-if="cruxList"
                v-for="(radio, index) in cruxList"
                :key="index"
                :label="radio.value">
                {{radio.content}}
                </el-radio-button>
            </el-radio-group>
        </div>
        <h3 class="data-name"><i></i>趋势图</h3>
        <div class="line_chart" id="line_chart"></div>
        <h3 class="data-name"><i></i>详细数据</h3>
        <el-table
        :data="tableData"
        stripe
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
</template>

<script>
    import $ from 'jquery'
    import echarts from 'echarts'
    export default {
        name: 'TrendData',
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
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                // conf
                crux: conf.crux || 'NewUser',
                // self
                dateValue: null,
                xAxis: null,
                series: null,
                cruxList: null,
                channelList: null,
                channel: '0',
                versionList: null,
                version: '0',
                systemList: [{
                    value: 0,
                    content: '全部系统'
                }, {
                    value: 'android',
                    content: '安卓'
                }, {
                    value: 'ios',
                    content: '苹果'
                }],
                system: 0,
                // table
                tableItems: [{
                    data: 'date',
                    label: '日期',
                }, {
                    data: 'NewUser',
                    label: '新增用户'
                }, {
                    data: 'ActiveUser',
                    label: '活跃用户'
                }, {
                    data: 'SessionCount',
                    label: '启动次数'
                }, {
                    data: 'TotalUser',
                    label: '累计用户'
                }],
                tableData: []
            }
        },
        methods: {
            reloading() {                
                let vm = this;
                console.log(111);
                
                $.ajax({
                    url: `/api/dataplatform/gov/app/data_list?crux=${vm.crux}`,
                    type: 'POST',
                    data: {
                        date: this.dateValue ? [`${this.formDate(vm.dateValue[0])}`,`${this.formDate(vm.dateValue[1])}`] : [],
                        channel: this.channel,
                        version: this.version,
                        crux: this.crux,
                        system: this.system
                    },
                    success(res) {
                        console.log(222, res);
                        
                        if (res) {
                            let data = res.data;
                            if (data) {
                                let xAxis = data.xAxis.data;
                                let series = data.series.data;
                                let list = data.list;
                                if (xAxis) {
                                    vm.dateValue = [xAxis[0], xAxis[xAxis.length-1]];
                                    vm.xAxis = xAxis;
                                }
                                vm.series = series;
                                vm.tableData = list;
                                vm.initChart();
                            }
                        } else {
                            console.log('返回值有误');
                        }
                    },
                    error(err) {
                        console.log('data请求失败', err);
                    }
                })
            },
            initChart() {
                let myChart = echarts.init(document.getElementById('line_chart'));
                myChart.setOption({
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data: this.xAxis || []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.series || [],
                        type: 'line'
                    }]
                });
            },
            getSearchList(name) {
                let vm = this;
                $.ajax({
                    url: `/api/dataplatform/gov/app/search_filed?type=${name}`,
                    type: 'GET',
                    success(res) {
                        console.log(333, res);
                        
                        if(res) {
                            switch (name) {
                                case 'crux':
                                    vm.cruxList = res.data                                    
                                    break;
                                case 'channel':
                                    vm.channelList = res.data                                
                                    break;
                                case 'version':
                                    vm.versionList = res.data                                
                                    break;
                                default:
                                    break;
                            }
                        }
                    },
                    error(err) {
                        console.log('search list请求失败', err);
                    }
                })
            },
            obj2Arr(obj) {
                let arr = [];
                for(let key in obj) {
                    arr.push(obj[key])
                }
                return arr;
            },
            formDate(val) {
                let newDate = new Date(val);
                let year = newDate.getFullYear();
                let month = newDate.getMonth()+1 > 9 ? newDate.getMonth()+1 : `0${newDate.getMonth()+1}`;
                let day = newDate.getDate() > 9 ? newDate.getDate() : `0${newDate.getDate()}`;
                return `${year}-${month}-${day}`
            }
        },
        mounted () {
            this.getSearchList('crux')
            this.getSearchList('channel')
            this.getSearchList('version')
            this.reloading()
        },
    }
</script>

<style lang="less" scoped>
.trend-data {
    width: 100%;
    .line_chart {
        width: 100%;
        height: 420px;
        // background-color: #ddd;
        // border: 1px solid #ddd;
    }
    .data-radio {
        margin: 8px 0;
        border: 1px solid #eee;
        border-radius: 4px;
    }
    .data-name {
        height: 30px;
        line-height: 30px;
        margin: 10px 0;
        font-size: 16px;
        color: #888;
        font-weight: normal;
        i {
            display: inline-block;
            vertical-align: middle;
            height: 100%;
            width: 8px;
            background-color: #555;
            margin-right: 6px;
        }
    }
}
</style>