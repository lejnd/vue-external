<template>
<div class="mp-data">
    <div class="item" v-for="(item, index) in items" :key="index">
        <div class="head">
            {{item.title}}
            <i class="moreIcon">></i>
        </div>
        <h3 class="value">{{item.value}}</h3>
        <div class="dec">
            日<img v-if="item.same_ratio[0]=='+'" :src="arrowUpIcon" alt=""><img v-else :src="arrowDownIcon" alt=""><span>{{item.same_ratio ? item.same_ratio.substring(1) : ''}}</span>
        </div>
        <div class="foo">
            <span class="total-name">累计{{item.title}}</span>
            <span class="total">{{item.total}}</span>
        </div>
    </div>
</div>
</template>

<script>
// import $ from 'jquery'
export default {
    name: 'MpData',
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
            text: conf.text,
            ajaxUrl: conf.ajaxUrl || '/api/dataplatform/gov/wx-app/s_count',
            ajaxData: conf.ajaxData || {},
            arrowUpIcon: conf.arrowUpIcon,
            arrowDownIcon: conf.arrowDownIcon,
            items: null
        }
    },
    methods: {
        ajax() {
            let vm = this;
            $.ajax({
                url: this.ajaxUrl,
                methods: 'POST',
                data: this.ajaxData,
                success(res) {
                    try {
                        vm.items = res.data;
                    }
                    catch(err) {
                        console.log(err)
                    }
                }
            })
        }
    },
    mounted () {
        this.ajax();
    }
}
</script>

<style lang="less" scoped>
.mp-data {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .item {
        border: 1px solid #ddd;
        box-sizing: border-box;
        width: 23%;
        .head {
            height: 35px;
            line-height: 35px;
            border-bottom: 1px solid #ddd;
            padding-left: 20px;
            padding-right: 12px;
            font-size: 14px;
            color: #777;
            .moreIcon {
                font-style: normal;
                float: right;
            }
        }
        .value {
            text-align: center;
            margin: 20px auto 5px auto;
            font-size: 22px;
            color: #777;
            font-weight: bold;
        }
        .dec {
            text-align: center;
            font-size: 12px;
            margin-bottom: 40px;
            img {
                height: 12px;
                vertical-align: middle;
                margin-left: 5px;
            }
        }
        .foo {
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
            font-size: 12px;
            color: #666;
            .total {
                float: right;
                font-size: 18px;
                padding-right: 20px;
            }
        }
    }
}
</style>