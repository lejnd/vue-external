<template>
  <div class="container" id="app">
    <!-- <wau-time-block :conf="timeblock"></wau-time-block> -->
    <!-- <wii-test :conf="testname"></wii-test> -->
    <!-- <wau-demo-one :conf="demoOneConf"></wau-demo-one> -->
    <!-- <date-range></date-range> -->
    <!-- <title-bar></title-bar> -->
    <!-- <time-data :conf="timeDataConf"></time-data> -->
    <!-- <trend-data></trend-data> -->
    <!-- <search-bar></search-bar> -->
    <!-- <travel-mode></travel-mode> -->
    <!-- <mp-data :conf="timeDataConf"></mp-data> -->

    <!-- <vue-map></vue-map> -->

    <!-- <vue-table-modal></vue-table-modal> -->
    <router-view />
  </div>
</template>

<script>
import WiiTest from 'components/test/index.vue'
import WauDemoOne from 'components/demoone/index.vue'
import WauTimeBlock from 'components/timeblock/index.vue'
import TimeData from 'components/timedata/index.vue'
import TitleBar from 'components/titleBar/index.vue'
import TrendData from 'components/trendData/index.vue'
import MpData from 'components/trendData/mpdata.vue'

// 投诉
import DateRange from 'components/daterange/index.vue'
import SearchBar from 'components/complainData/search.vue'
import TravelMode from 'components/complainData/travelMode.vue'
import VueTableModal from 'components/tableModal/index.vue'

// map
import VueMap from 'components/map/index.vue'

export default {
  name: 'app',
  data(){
    return {
      timeDataConf: {
        arrowUpIcon: '../static/img/arrow-up-a.png',
        arrowDownIcon: '../static/img/arrow-down-a.png',
        androidIcon: '../static/img/Android.png',
        iosIcon: '../static/img/Apple.png'
      },
      testname: {
        name: 'jinx'
      },
      timeblock: {
        start_time: '00:00:01',
        label: '剩余时间: '
      },
      demoOneConf: {
        table_header: [{
          name: '编号'
        },{
          name: '名称'
        },{
          name: '库存',
          type: 'store'
        },{
          name: '状态'
        }],
        request: {
          model: 'ajax',
          url: '/platform/plugin/get_list',
          method: 'POST'
        }
      }
    }
  },
  components:{
    // WiiTest,
    // WauDemoOne,
    // WauTimeBlock,
    // DateRange,
    // TimeData,
    // TitleBar,
    // TrendData,
    // MpData,
    // SearchBar,
    // TravelMode,
    // SearchInput,
    VueMap,
    VueTableModal
  }
}
</script>

<style lang="less">
body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
a {
    text-decoration: unset;
}
</style>
