import Vue from 'vue'
import Router from 'vue-router'
// import Index from '@/components/Index'

import Index from '@/pages/index.vue'
import TableModal from '@/pages/tablemodal.vue'
import MapView from '@/pages/map.vue'
import FormCom from '@/pages/form.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Index',
            component: Index
        },
        {
            path: '/table_modal',
            name: 'TableModal',
            component: TableModal
        },
        {
            path: '/map',
            name: 'Map',
            component: MapView
        },
        {
            path: '/form',
            name: 'FormCom',
            component: FormCom
        }
    ]
})
