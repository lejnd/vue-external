<template>
<transition name="fade">
    <div class="v-notice" :class="{ 'vsuccess': type=='success', 'verror': type=='error' }" v-if="show">
        {{msg}}
    </div>
</transition>
</template>

<script>
    export default {
        name: 'VNotice',
        data() {
            return {
                show: false,
                msg: '',
                type: ''
            }
        },
        methods: {
            noticeShow() {
                this.show = true;
                setTimeout(() => {
                    this.show = false;
                }, 3000)
            }
        }
    }
</script>

<style lang="less">

</style>