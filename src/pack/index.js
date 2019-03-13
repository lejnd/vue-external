/**
 * 配置组件的打包，引入需要打包的组件，并加入到components里面
 * @author warrenyang
 */

import Vue from 'vue'
/**
 * 组件引入
 */
// import WauVueTest from '../components/test/index.vue'
// import WauDemoOne from '../components/demoone/index.vue'
// import WauTimeBlock from '../components/timeblock/index.vue'

// import DateRange from '../components/daterange/index.vue'
// import TitleBar from '../components/titleBar/index.vue'
// import TimeData from '../components/timedata/index.vue'

// import TrendData from '../components/trendData/index.vue'
// import MpData from '../components/trendData/mpdata.vue'

// import SearchBar from '../components/complainData/search.vue'

// import VueTableModal from '../components/tableModal/index.vue'

import VueMap from '../components/map/index.vue'


var components = [VueMap]

components.map(component => {
    Vue.component(component.name, component);
});
