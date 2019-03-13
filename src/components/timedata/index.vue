<template>
<div class="time-data">
    <div v-if="items && items[0]" class="flexbox" v-for="(item, index) in items" :key="index">
        <div class="flexcol">
            <div class="flex1">{{item.title}}</div>
            <div class="flexmain">{{item.value}}</div>
            <div class="flex1">
                <div class="detail">日</div>
                <div class="detail">
                    <img v-if="item.same_ratio[0]=='+'" :src="arrowUpIcon" alt="">
                    <img v-else :src="arrowDownIcon" alt="">
                    <span>{{item.same_ratio.substring(1)}}</span>
                </div>
            </div>
        </div>
        <div class="flexcol">
            <div class="flex2">
                <img :src="androidIcon" alt="">
                <span>{{item.android}}</span>
            </div>
            <div class="flex2">
                <img :src="iosIcon" alt="">
                <span>{{item.ios}}</span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import $ from 'jquery'
    export default {
        name: 'TimeData',
		props: {
            conf: {
                type: Object,
                default: function() {
                    return {};
                }
            }
        },
		data(){
            let conf = this.conf
			return {
                arrowUpIcon: conf.arrowUpIcon,
                arrowDownIcon: conf.arrowDownIcon,
                androidIcon: conf.androidIcon,
                iosIcon: conf.iosIcon,
                // 请求参数
                query: conf.query || {},
                // 请求地址
                requestUrl: conf.requestUrl || '/api/dataplatform/gov/app/day_list',
                method: conf.method || 'GET',
                // 轮询时间
                loopTime: conf.loopTime || 10000,
                items: []
			}
        },
        methods: {
            request() {
                let vm = this;
                $.ajax({
                    type: this.method,
                    url: this.requestUrl,
                    data: this.query,
                    success: function(res) {
                        vm.items = res.data;
                    }
                })
            }
        },
        mounted () {
            let vm = this;
            vm.request();
            setInterval(function() {
                vm.request()
            }, this.loopTime);
        }
    }
</script>

<style lang="less">
.time-data {
    font-family: '微软雅黑';
    width: 100%;
    .flexbox {
        display: inline-flex;
        width: 25%;
        height: 100px;
        box-sizing: border-box;
        border: 1px solid #eee;
        align-items: center;
        .flexcol {
            flex: 1;
            width: 50%;
            align-items: center;
            padding-left: 5%;
            white-space: nowrap;
            .flex1 {
                flex-direction: column;
                flex: 1;
                font-size: 12px;
                .detail {
                    display: inline-block;
                    height: 24px;
                    line-height: 24px;
                    vertical-align: bottom;
                    img {
                        height: 50%;
                        vertical-align: middle;
                        margin-right: -5px;
                    }
                    span {
                        height: 100%;
                        vertical-align: middle;
                    }
                }
            }
            .flexmain {
                flex-direction: column;
                flex: 2;
                padding-bottom: 5px;
                font-size: 18px;
                color: rgb(100, 100, 100);
            }
            .flex2 {
                flex-direction: column;
                flex: 2;
                font-size: 12px;
                height: 30px;
                line-height: 30px;
                img {
                    height: 56%;
                    vertical-align: middle;
                }
                span {
                    height: 100%;
                    vertical-align: middle;
                }
            }
        }
    }
}    
</style>