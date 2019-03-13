<!-- 单文件Vue混合组件示例 -->

<template>
<div class="vue-table-modal">
    <a href="javascript:;" class="vbtn vmain-btn" @click="openModal">{{name}}</a>
    <transition name="fade">
        <div class="v-notice" :class="{ 'vsuccess': noticeType=='success', 'verror': noticeType=='error' }" :style="{'top': scrollTop+30+'px'}" v-if="show">
            {{errorMsg}}
        </div>
    </transition>    
    <div v-if="modal" class="vue-modal" :style="{'top': scrollTop/2-70+'px'}">
        <div class="vue-mask" @click="closeModal"></div>
        <div class="vuemodal-container">
            <div class="vuemodal-header">{{name}}</div>
            <div class="vuemodal-content">
                <div class="table-flex">
                    <div class="main-table">
                        <div class="vsearch">
                            <div class="search-item" v-for="(item, index) in inputArr" :key="item.key">
                                <span class="vlabel" v-if="item.name">{{item.name}}</span>
                                <input type="text" v-model="input[item.key]" :placeholder="placeholders[index]">
                                <!-- <div class="vtip">关键字：导游姓名、导游证号、身份证、手机号、所属旅行社</div> -->
                            </div>
                            <div class="search-item" v-if="searchCity != 'hide'">
                                <span class="vlabel">行政区划</span>
                                <div ref="vselectCity" class="vselect">
                                    <div class="vselect-input" @click="toggleSelectCity">
                                        <input type="text" v-model="region.cityId" hidden />
                                        <input type="text" v-model="cityName" placeholder="州市" readonly />
                                        <div class="varrow" :class="{ 'arrow-up': isSelectCity  }"></div>
                                    </div>
                                    <ul class="options" v-if="isSelectCity">
                                        <li v-for="item in cityList" :key="item.value" @click="setCity(item)">{{item.label}}</li>
                                    </ul>
                                </div>
                                <div ref="vselectCounty" class="vselect">
                                    <div class="vselect-input" @click="toggleSelectCounty">
                                        <input type="text" v-model="region.countyId" hidden />
                                        <input type="text" v-model="countyName" placeholder="区县" readonly />
                                        <div class="varrow" :class="{ 'arrow-up': isSelectCounty  }"></div>
                                    </div>
                                    <ul class="options" v-if="isSelectCounty">
                                        <li v-for="item in countyList" :key="item.value" @click="setCounty(item)">{{item.label}}</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="search-item vbtns" v-if="!(searchCity == 'hide' && Object.keys(input).length == 0)">
                                <a href="javascript:;" class="vbtn vdefult" @click="clearForm">清空</a>
                                <a href="javascript:;" class="vbtn" @click="getList">查询</a>
                            </div>
                        </div>
                        <table border="0">
                            <tr>
                                <th v-for="th in ths" :key="th">{{th}}</th>
                            </tr>
                            <tr class="table-row" v-for="(item, index1) in list" :key="index1" @click="checked(item)">
                                <td class="check" :class="{ 'checked': checked_ids.includes(item.id) }"><span></span></td>
                                <td v-for="(key, index2) in keys" :key="index2">{{item[key]}}</td>
                                <td class="todo" style="width: 45px"><span @click="gotoDetail(item.id)">详情</span></td>
                            </tr>
                        </table>
                        <v-pagination
                            :pageSize="page.pageSize"
                            :total="page.total"
                            :currentPage="pageIndex"
                            @changePage="getNewPage"
                            style="margin-top: 10px">
                        </v-pagination>
                    </div>
                    <div class="select-table">
                        <div class="tital">已选列表：</div>
                        <table v-if="checkeds && checkeds.length > 0">
                            <tr>
                                <th v-for="th in ths2" :key="th">{{th}}</th>                                
                            </tr>
                            <tr class="table-row" v-for="(item, index1) in checkeds" :key="index1">
                                <td v-for="(key, index2) in keys2" :key="index2">{{item[key]}}</td>
                                <td class="todo" style="width: 45px"><span @click="removeCheck(item.id)">删除</span></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="vuemodal-btn">
                <a href="javascript:;" class="vbtn vdefult" @click="closeModal">取消</a>
                <a href="javascript:;" class="vbtn" @click="doBinding">确定</a>
            </div>
        </div>
    </div>
</div>
</template>



<script>
import $ from 'jquery'
import VPagination from './pagination.vue'
export default {
    name: 'VueTableModal',
    components: {
        VPagination
    },
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
            // 配置按钮名称
            name: conf.name || '打开弹窗',
            // 配置可选列表
            tableData: conf.tableData || [
                { text: '导游姓名', key: 'name' }, 
                { text: '证号', key: 'idCard' },
                { text: '联系电话', key: 'phone' },
                { text: '星级', key: 'guideLevelStr' }, 
                { text: '技术等级', key: 'guideTypeStr' },
                { text: '所属旅行社', key: 'travelName' },
            ],
            // 配置已选列表
            selectTable: conf.selectTable || [
                { text: '导游姓名', key: 'name' }, 
                { text: '证号', key: 'idCard' },
            ],
            // 配置搜索输入框，条件查询字段
            input: conf.input || {
                aaa: '',
            },
            // 输入框label配置，保持顺序一致
            inputLabel: conf.inputLabel || ['关键字'],
            // 数组，输入框占位提示，保持顺序一致
            placeholders: conf.placeholders || ['导游姓名/导游证号/身份证/手机号/所属旅行社'],
            // 开启关闭行政区域查询 'hide'隐藏
            searchCity: conf.searchCity || 'show',
            // 行政区划州市列表接口地址
            queryAreaDataOne: conf.queryAreaDataOne || '/api/guideAndTravel?method=queryAreaDataOne',
            // 行政区划区县列表接口地址
            queryAreaDataTwo: conf.queryAreaDataTwo || '/api/guideAndTravel?method=queryAreaDataTwo',
            // 可选列表请求地址
            listUrl: conf.listUrl || '/api/guideAndTravel?method=guidePage',
            // 配置跳转详情URL，{id}代表参数变量
            openUrl: conf.openUrl || '/detail?id={id}',
            // 配置绑定接口地址
            bindingUrl: conf.bindingUrl || '',
            // 绑定接口添加请求参数
            bindingData: conf.bindingData || {},
            cityList: [],
            countyList: [],
            list: [],
            modal: false,
            isSelectCity: false,
            isSelectCounty: false,
            region: {
                cityId: '',
                countyId: ''
            },
            cityName: '',
            countyName: '',
            page: {
                pageSize: 10,
                total: 100,
                currentPage: 1,
            },
            pageIndex: 1,
            checkeds: [],
            errorMsg: '',
            show: false,
            noticeType: '',
            scrollTop: 0,
        }
    },
    computed: {
        inputArr() {
            if(!this.input || this.input.constructor !== Object) return []
            return Object.keys(this.input).map((key, index) => ({
                name: this.inputLabel[index],
                key: key
            }))
        },
        ths() {
            if (!this.tableData) return []; 
            return [
                '选择',
                ...this.tableData.map((item) => item.text),
                '操作'
            ]
        },
        keys() {
            if (!this.tableData) return []; 
            return this.tableData.map((item) => item.key);
        },
        ths2() {
            if (!this.selectTable) return [];
            return [
                ...this.selectTable.map((item) => item.text),
                '操作'
            ]
        },
        keys2() {
            if (!this.selectTable) return [];
            return this.selectTable.map((item) => item.key);
        },
        checked_ids() {
            return this.checkeds ? this.checkeds.map((item) => item.id) : []
        }
    },
    methods: {
        openModal() {
            this.clearForm();
            this.checkeds = [];
            this.scrollTop = window.parent.document.documentElement.scrollTop;
            this.modal = true;
            let body = document.getElementsByTagName("body")[0]
            let pBody = window.parent.document.getElementsByTagName("body")[0]
            body.setAttribute('style', 'overflow: hidden');
            pBody.setAttribute('style', 'overflow: hidden');
        },
        closeModal() {
            this.modal = false;
            let body = document.getElementsByTagName("body")[0]
            let pBody = window.parent.document.getElementsByTagName("body")[0]
            body.setAttribute('style', 'overflow: auto');
            pBody.setAttribute('style', 'overflow: auto');
        },
        toggleSelectCity() {
            this.isSelectCity = !this.isSelectCity;
        },
        toggleSelectCounty() {
            this.isSelectCounty = !this.isSelectCounty;
        },
        getCityList() {
            let vm = this;
            $.ajax({
                type: 'GET',
                url: this.queryAreaDataOne,
                success: function(res) {
                    if (typeof res == 'string') {
                        res = JSON.parse(res)
                    }
                    vm.cityList = res.data.list
                }
            })
        },
        getCountyList() {
            let vm = this;
            $.ajax({
                type: 'POST',
                url: this.queryAreaDataTwo,
                data: {
                    code: this.region.cityId
                },
                success: function(res) {
                    if (typeof res == 'string') {
                        res = JSON.parse(res)
                    }
                    vm.countyList = res.data.list
                }
            })
        },
        setCity(item) {
            this.region.cityId = item.value;
            this.cityName = item.label;
            this.isSelectCity = false; 
            this.getCountyList();
        },
        setCounty(item) {
            this.region.countyId = item.value;
            this.countyName = item.label;
            this.isSelectCounty = false;
        },
        getList() {
            let vm = this;
            let data = this.input || {};
            if (this.searchCity != 'hide') {
                data = Object.assign({}, data, this.region)
            }
            data = Object.assign({}, data, { p: this.pageIndex })
            $.ajax({
                type: 'POST',
                url: this.listUrl,
                data: data,
                success: function(res) {
                    if (typeof res == 'string') {
                        res = JSON.parse(res)
                    }
                    vm.list = res.data.list
                    let pagination = res.data.pagination || {};
                    vm.page = {
                        total: pagination.total || 100,
                        pageSize: pagination.page_size || 5,
                        currentPage: pagination.current_page || 1
                    }
                }
            })
        },
        getNewPage(pageIndex) {
            this.pageIndex = pageIndex;
            this.getList();
        },
        clearForm() {
            if (this.input) {
                for (let key in this.input) {
                    if (this.input.hasOwnProperty(key)) {
                        this.input[key] = ''
                    }
                }
            }
            if (this.searchCity != 'hide') {
                for (const key in this.region) {
                    if (this.region.hasOwnProperty(key)) {
                        this.region[key] = ''
                    }
                }
                this.cityName = ''
                this.countyName = ''
            }
            this.pageIndex = 1;
            this.getList();
        },
        checked(item) {
            if (this.checked_ids.includes(item.id)) {
                this.removeCheck(item.id)
                return
            }
            this.checkeds.unshift(item);
        },
        removeCheck(id) {
            this.checkeds = this.checkeds.filter((item) => item.id != id)
        },
        gotoDetail(id) {
            if (!this.openUrl) return;
            let openUrl = this.openUrl.replace('{id}', id);
            window.open(`${openUrl}`)                
        },
        doBinding() {
            let vm = this;
            let data = {
                ids: this.checkeds.map((item) => item.id),
                names: this.checkeds.map((item) => item.name)
            }
            data = Object.assign({}, data, this.bindingData)
            $.ajax({
                type: 'POST',
                url: this.bindingUrl,
                data: data,
                success: function() {
                    vm._Notice('操作成功', 'success')
                    vm.closeModal()
                    window.location.reload()
                },
                error: function() {
                    vm._Notice('操作失败', 'error')
                }
            })
        },
        _Notice(msg, type='') {
            this.errorMsg = msg;
            this.noticeType = type;
            this.show = true;
            setTimeout(() => {
                this.show = false;
            }, 3000)
        }
    },
    mounted () {
        this.getCityList();
        // this.getList();
        // 点击下拉框范围以外，关闭下拉框
        document.addEventListener('click', (e) => {
            let vselectCity = this.$refs.vselectCity;
            let vselectCounty = this.$refs.vselectCounty;
            if (!vselectCity || !vselectCounty) return;
            if (!vselectCity.contains(e.target)) {
                this.isSelectCity = false
            }
            if (!vselectCounty.contains(e.target)) {
                this.isSelectCounty = false
            }
        })
    }
}
</script>

<style lang="less">

.vue-table-modal{
    display: inline-block;
    box-sizing: border-box;
    color: #515a6e;
    width: 100%;
    li {
        list-style: none;
    }
    ul, li {
        margin: 0;
        padding: 0;
    }
    table {
        width: 100%;
        .table-row {
            &:hover {
                background-color: #ebf7ff;
            }
        }
    }
    .vbtn {
        padding: 7px 13px;
        border: 1px solid #6fb3e0;
        background-color: #6fb3e0;
        color: #fff;
        font-size: 14px;
        text-decoration: none;
        &.vdefult {
            background-color: #fff;
            color: #555;
        }
        &:active {
            background-color: #eee;
        }
        &.vmain-btn {
            display: inline-block;
            padding: 0px 14px;
            height: 40px;
            line-height: 40px;
            width: 100%;
            text-align: center;
        }
    }
    input {
        padding: 5px;
        width: 297px;
        border: 1px solid #dcdee2;
        font-size: 12px;
    }
    .vue-modal {
        position: fixed;
        z-index: 10;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        .vue-mask {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
        }
        .vuemodal-container {
            background: #fff;
            width: 90%;
            position: relative;
            border-radius: 3px;
            margin: 0 auto;
            .vuemodal-content {
                max-height: 600px;
                overflow-y: auto;
                padding: 15px;
                .vsearch {
                    display: flex;
                    flex-wrap: wrap;
                    font-size: 12px;
                    margin-bottom: 10px;
                    .search-item {
                        margin-right: 15px;
                        padding-bottom: 10px;
                        line-height: 29px;
                        .vlabel {
                            min-width: 60px;
                            display: inline-block;
                            text-align: right;
                        }
                        &.vbtns {
                            flex: 1;
                            min-width: 100px;
                            text-align: right;
                            .vbtn {
                                padding: 4px 10px;
                                font-size: 12px;
                            }
                        }
                    }
                }
                .table-flex {
                    display: flex;
                    justify-content:space-between;
                    .tital {
                        font-size: 12px;
                        padding: 5px;
                    }
                    table {
                        border: 1px solid #e9e9e9;
                        border-bottom: 0;
                        font-size: 12px;
                        border-spacing: 0;
                        th, td {
                            border-bottom: 1px solid #e9e9e9;
                            border-right: 1px solid #e9e9e9;
                            text-align: center;
                            padding: 3px 5px;
                            font-weight: normal;
                            &:last-child {
                                border-right: 0;
                            }
                        }
                        th {
                            background-color: #f5f5f5;
                        }
                        td {
                            &.check {
                                cursor: pointer;
                                span {
                                    display: block;
                                    width: 8px;
                                    height: 8px;
                                    background-color: #fff;
                                    border: 3px solid #fff;
                                    box-shadow: 0 0 1px #999;
                                    margin: 0 auto;
                                    border-radius: 1px;
                                }
                                &.checked {
                                    span {
                                        background-color: #2db7f5;
                                    }
                                }
                            }
                            &.todo {
                                span {
                                    color: #2db7f5;
                                    padding: 0 4px;
                                    cursor: pointer;
                                    font-size: 12px;
                                }
                            }
                        }
                    }
                    .main-table {
                        width: 69%;
                        min-width: 525px;
                        th, td {
                            padding-top: 5px;
                            padding-bottom: 5px;
                        }
                    }
                    .select-table {
                        width: 28%;
                        padding: 10px;
                        box-shadow: 0 0 2px #ddd;
                        // max-height: 500px;
                        // overflow-y: auto;
                    }
                }
            }
            .vuemodal-header {
                padding: 15px;
                border-bottom: 1px solid #eee;
                margin-bottom: 10px;
            }
            .vuemodal-btn {
                padding: 15px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                border-top: 1px solid #eee;
                .vbtn {
                    margin-left: 3px;
                }
            }
        }
    }
    .vselect {
        display: inline-block;
        vertical-align: top;
        position: relative;
        .vselect-input {
            position: relative;
            input {
                width: 125px;
                padding-right: 20px;
            }
            .varrow {
                position: absolute;
                top: 50%;
                right: 8px;
                width: 6px;
                height: 6px;
                border-top: 1px solid #cdcdcd;
                border-right: 1px solid #cdcdcd;
                transform: rotate(135deg);
                margin-left: 5px;
                margin-top: -5px;
                &.arrow-up {
                    transform: rotate(-45deg);
                    margin-top: -3px;
                }
                &.arrow-right {
                    transform: rotate(45deg);
                }
                &.arrow-left {
                    transform: rotate(-135deg);
                }
            }
        }
        .options {
            position: absolute;
            bottom: -1;
            background-color: #fff;
            width: 99%;
            max-height: 160px;
            overflow-y: auto;
            margin-top: 2px;
            padding: 5px 0;
            box-shadow: 0px 3px 8px #aaa;
            li {
                padding: 4px 10px;
                line-height: 20px;
                cursor: pointer;
                &:hover{
                    background-color: #eee;
                }
            }
        }
    }
    .verror-msg {
        color: #ed4014;
        margin: 0 10px;
        font-size: 12px;
        font-weight: normal;
    }
    .vpagination {
        display: flex;
        flex-wrap: nowrap;
        justify-items: center;
        align-items: center;
        padding: 5px 0;
        font-size: 12px;
        .vptext {
            margin: 0 5px;
        }
        input {
            &.vpnum {
                width: 50px;
                border-radius: 4px;
                border: 1px solid #dedede;
            }
        }
        .vpbox {
            min-width: 22px;
            height: 28px;
            line-height: 26px;
            padding: 0 3px;
            border: 1px solid #dcdee2;
            border-radius: 3px;
            margin: 0 2px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            &.current {
                color: #2db7f5;
                border-color: #2db7f5;
            }
            &.dis {
                background-color: #f5f5f5;
                cursor: not-allowed;
            }
        }
        .varrow {
            width: 6px;
            height: 6px;
            border-top: 1px solid #dcdee2;
            border-right: 1px solid #dcdee2;
            transform: rotate(135deg);
            // margin-left: 5px;
            // margin-top: 5px;
            &.arrow-up {
                transform: rotate(-45deg);
                margin-top: -3px;
            }
            &.arrow-right {
                transform: rotate(45deg);
                margin-left: -3px;
            }
            &.arrow-left {
                transform: rotate(-135deg);
                margin-left: 3px;
            }
        }
    }

    .v-notice {
        width: 150px;
        padding: 15px;
        position: fixed;
        right: 0px;
        top: 50px;
        background-color: #555;
        color: #f5f5f5;
        font-size: 12px;
        z-index: 11;
        &.vsuccess {
            background-color: #45861f;
        }
        &.verror {
            background-color: #ad4343;
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: right .2s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        right: -150px;
    }
}
</style>