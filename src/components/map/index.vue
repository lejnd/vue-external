<!-- 单文件Vue混合组件示例 -->

<template>
	<div class="vue-map">
        <div class="search-row">
            <span class="vm-label">经度</span>
            <input type="text" readonly :name="latName" placeholder="经度" v-model="lat" />
            <span class="vm-label">纬度</span>
            <input type="text" readonly :name="lngName" placeholder="纬度" v-model="lng" />
        </div>
        <div class="search-row" v-if="showAddress != 'hide'">
            <span class="vm-label">地址</span>
            <input type="text" style="flex: 1" readonly :name="addressName" placeholder="地址" v-model="address" />
        </div>
        <div class="vue-map-box">
            <!-- <div class="vm-search">
                <div class="vsearch-bar">
                    <input class="vkeyword" id="vkeyword" type="textbox" v-model="keyword" @change="searchKeyword">
                    <input class="vsearch" type="button" value="搜索" @click="searchKeyword">
                </div>
                <div class="infoDiv" id="infoDiv"></div>
            </div> -->
            <div class="vsearch-bar">
                <div ref="vselectCity" class="vselect vcity">
                    <div class="vselect-input" @click="toggleSelectCity">
                        <input type="text" v-model="cityName" placeholder="切换区域" readonly />
                        <div class="varrow" :class="{ 'arrow-up': isSelectCity  }"></div>
                    </div>
                    <ul class="options" v-if="isSelectCity">
                        <li v-for="item in cityList" :key="item" @click="setCity(item)">{{item}}</li>
                    </ul>
                </div>
                <input class="vkeyword" id="vkeyword" type="textbox" v-model="keyword" @change="searchKeyword">
                <input class="vsearch" type="button" value="搜索" @click="searchKeyword">
            </div>
            <div class="txMap" id="txMap"></div>
            <div class="infoDiv" id="infoDiv"></div>
        </div>
	</div>
</template>

<script>
export default {
    name: 'VueMap',
    props: {
        conf: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data(){
        /**
         * 参数均来自yml里面的conf配置，通过this.conf获取
         */
        let conf = this.conf;
        return {
            // 经度字段名
            latName: conf.latName,
            // 纬度字段名
            lngName: conf.lngName,
            // 配置地图key
            key: conf.key || '3HTBZ-GY4WU-MJHVW-4DVYZ-2OETJ-PSFAU',
            // 地址字段名，不传地址就不用配置
            addressName: conf.appName || '',
            // 配置‘hide’可以隐藏地址
            showAddress: conf.showAddress || '',
            // 配置点击地图的图表地址，使用默认就不需配置
            clickIcon: conf.clickIcon || 'https://lbs.qq.com/javascript_v2/img/center.gif',
            // 传入经度value
            lat: conf.lat || '',
            // 传入纬度value
            lng: conf.lng || '',
            // 传入地址value
            address: conf.address || '',
            map: null,
            searchService: null,
            citylocation: null,
            markers: [],
            keyword: '酒店',
            clickMarkers: [],
            center: [25.0453000000, 102.7097300000],
            isSelectCity: false,
            cityName: '昆明',
            cityList: ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄', '红河', '文山', '西双版纳', '大理', '德宏', '怒江', '迪庆']
        }
    },
    watch: {
        cityName(v, o) {
            this.searchService.setLocation(v)
        }
    },
    methods: {
        setScript() {
            let vm = this;
            let script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "//map.qq.com/api/js?v=2.exp&callback=mapinit&key=" + this.key;
            document.body.appendChild(script);
            function mapinit() {
                vm.init()
                vm.searchPagin();
                vm.clickEvent();
                if (vm.lat && vm.lng) {
                    vm.latLng2address(vm.lat, vm.lng)
                }    
            }
            window.mapinit = mapinit
        },
        init() {
            let vm = this;
            this.map = new qq.maps.Map(document.getElementById('txMap'), {
                center: new qq.maps.LatLng(vm.lat || vm.center[0], vm.lng || vm.center[1]),      // 地图的中心地理坐标。
                zoom: 12,                                                // 地图的中心地理坐标。
                draggableCursor : 'crosshair',     //设置鼠标拖拽元素样式
                draggingCursor : 'move'       //设置鼠标移动样式
            });
            // //获取城市列表接口设置中心点
            // this.citylocation = new qq.maps.CityService({
            //     complete : function(result){
            //         vm.map.setCenter(result.detail.latLng);
            //     }
            // });
            // //调用searchLocalCity();方法    根据用户IP查询城市信息。
            // this.citylocation.searchLocalCity();
            //地图信息窗口
            vm.infoWin = new qq.maps.InfoWindow({
                map: vm.map
            });
        },
        searchPagin() {
            let vm = this;
            const PAGE_CAPACITY = 5;
            let latlngBounds = new qq.maps.LatLngBounds();
            this.searchService = new qq.maps.SearchService({
                //设置搜索范围为北京
                location: this.cityName,
                //设置搜索页码为1
                pageIndex: 0,
                //设置每页的结果数为5
                pageCapacity: PAGE_CAPACITY,
                //设置展现查询结构到infoDIV上
                panel: document.getElementById('infoDiv'),
                //设置动扩大检索区域。默认值true，会自动检索指定城市以外区域。
                autoExtend: true,
                //检索成功的回调函数
                complete: function(results) {
                    //设置回调函数参数                    
                    var pois = results.detail.pois;
                    for (var i = 0, l = pois.length; i < l; i++) {
                        var poi = pois[i];
                        //扩展边界范围，用来包含搜索到的Poi点
                        latlngBounds.extend(poi.latLng);

                        (function(n) {
                            let num = n + 1;
                            let decoration = '<span style="color:#fff;font-size:10px;">' + num + '</span>'
                            var marker = new qq.maps.Marker({
                                map: vm.map,
                                // title: pois[n].name,
                                decoration: new qq.maps.MarkerDecoration(decoration, new qq.maps.Point(0, -12))
                            });
                            marker.setPosition(pois[n].latLng);
        
                            marker.setTitle(i + 1);
                            if (vm.markers.length >= PAGE_CAPACITY) {
                                vm.clearOverlays(vm.markers);
                                vm.infoWin.close();
                            }
                            vm.markers.push(marker);
        
        
                            qq.maps.event.addListener(marker, 'click', function() {
                                vm.infoWin.open();
                                vm.infoWin.setContent('<div style="width:280px;">' + pois[n].name + '<br><br>地址：' + pois[n].address + '</div>');
                                vm.infoWin.setPosition(pois[n].latLng);
                                vm.lat = pois[n].latLng.lat;
                                vm.lng = pois[n].latLng.lng;
                                vm.address = pois[n].address;
                                vm.mapChange(pois[n].latLng, 3);
                            });
                        })(i);

                        var infoDiv = document.getElementById("infoDiv");
                        qq.maps.event.addDomListener(infoDiv, "click", function(e) {
                            let li = e.path.find((v) => {
                                return v.nodeName == 'LI'
                            })
                            if (!li) return;
                            let n = parseInt(li.innerText.split('.')[0]) - 1;
                            vm.infoWin.open();
                            vm.infoWin.setContent('<div style="width:280px;">' + pois[n].name + '<br><br>地址：' + pois[n].address + '</div>');
                            vm.infoWin.setPosition(pois[n].latLng);
                            vm.lat = pois[n].latLng.lat;
                            vm.lng = pois[n].latLng.lng;
                            vm.address = pois[n].address;
                            vm.mapChange(pois[n].latLng);
                        });

                    }
                    //调整地图视野
                    vm.map.fitBounds(latlngBounds);
                },
                //若服务请求失败，则运行以下函数
                error: function() {
                    
                }
            });
        },
        clickEvent() {
            let vm = this;
            qq.maps.event.addListener(this.map, 'click', function(e) {
                vm.lat = e.latLng.lat;
                vm.lng = e.latLng.lng;
                vm.clearOverlays(vm.clickMarkers)
                let anchor = new qq.maps.Point(13, 13),
                    size = new qq.maps.Size(24, 24),
                    origin = new qq.maps.Point(0, 0),
                    icon = new qq.maps.MarkerImage(vm.clickIcon, size, origin, anchor);
            
                let marker = new qq.maps.Marker({
                    icon: icon,
                    map: vm.map,
                    position: e.latLng,
                })
                vm.clickMarkers.push(marker);
                vm.latLng2address(e.latLng.lat, e.latLng.lng)
            });
        },
        latLng2address(lat, lng) {
            let vm = this;
            let geocoder = new qq.maps.Geocoder({
                complete : function(result){
                    vm.address = result.detail.address
                    let cityFullName = result.detail.addressComponents.city
                    vm.cityName = vm.cityList.find((value) => {
                        return cityFullName.includes(value)
                    })
                }
            });
            let latLng = new qq.maps.LatLng(lat, lng);
            geocoder.getAddress(latLng);
        },
        // 清除标记
        clearOverlays(overlays) {
            let overlay;
            while (overlay = overlays.pop()) {
                overlay.setMap(null);
            }
        },
        searchKeyword() {
            var keyword = this.keyword
            this.clearOverlays(this.markers);
            this.clearOverlays(this.clickMarkers);  
            this.infoWin.close();         
            //根据输入的城市设置搜索范围
            // searchService.setLocation("北京");
            //根据输入的关键字在搜索范围内检索
            this.searchService.search(keyword);
        },
        mapChange(latLng, zoom=0) {
            let lat = latLng.lat;
            let lng = latLng.lng;            
            this.map.panTo(new qq.maps.LatLng(lat, lng));
            this.map.zoomTo((this.map.getZoom() + zoom));
        },
        toggleSelectCity() {
            this.isSelectCity = !this.isSelectCity;
        },
        setCity(item) {
            this.cityName = item;
            this.isSelectCity = false;
        }
    },
    mounted () {
        let vm = this;
        this.setScript();  
        // 点击下拉框范围以外，关闭下拉框
        document.addEventListener('click', (e) => {
            let vselectCity = this.$refs.vselectCity;
            if (!vselectCity) return;
            if (!vselectCity.contains(e.target)) {
                this.isSelectCity = false
            }
        })  
    }
}
</script>

<style lang="less">
.vue-map {
    font-size: 14px;
    border: 1px solid #d5d5d5;
    background-color: #f2f1ed;
    .vm-label {
        display: block;
        width: 40px;
        font-size: 12px;
        text-align: center;
    }
    input {
        padding: 5px 4px 6px;
        color: #858585;
        background-color: #fff;
        border: 0;
        &:disabled {
            background-color: #F5F5F5;
        }
        
    }
    .search-row {
        display: flex;
        align-items: center;
        margin: 10px;
        input {
            flex: 1;
        }
    }
    .vue-map-box {
        background-color: #f2f1ed;
        margin: auto;
        // display: flex;
        // .vm-search {
        //     flex: 1;
        //     .infoDiv {
        //         height: 430px;
        //         overflow-y: auto;
        //     }
        //     .vsearch-bar {
        //         display: flex;
        //         justify-content: center;
        //         .vkeyword {
        //             border: 0;
        //             margin: 2px;
        //             width: 70%;
        //         }
        //         .vsearch {
        //             border: 0;
        //             margin: 2px;
        //             padding: 4px 12px;
        //             color: #333;
        //         }
        //     }
        // }
        .vsearch-bar {
            display: flex;
            .vcity {
                width: 90px;
            }
            .vkeyword {
                border: 0;
                margin: 2px;
                flex: 1;
            }
            .vsearch {
                border: 0;
                margin: 2px;
                padding: 4px 12px;
                color: #333;
            }
        }
        .txMap {
            height: 460px;
            width: 100%;
        }
        .infoDiv {
            width: 100%;
            max-height: 400px;
            overflow-y: auto;
        }
    }
    .vselect {
        display: inline-block;
        vertical-align: top;
        position: relative;
        .vselect-input {
            position: relative;
            input {
                width: 88%;
                margin: 2px;
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
            z-index: 2;
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
}
</style>