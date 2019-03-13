<template>
    <div class="title-bar">
        <h2>
            {{name}}
            <span v-if="showTime">{{nowTime}}</span>
        </h2>
    </div>
</template>

<script>
    export default {
        name: 'TitleBar',
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
                name: conf.name || '标题',
                showTime: conf.showTime || true,
                nowTime: ''
            }
        },
        methods: {
            formTime(val) {
                return val > 9 ? val : `0${val}`;
            },
            getTime() {
                let newDate = new Date();
                let hours = this.formTime(newDate.getHours());
                let minutes = this.formTime(newDate.getMinutes());
                let seconds = this.formTime(newDate.getSeconds());
                this.nowTime = `${hours} : ${minutes} : ${seconds}`
            }
        },
        mounted () {
            setInterval(() => {
                this.getTime()
            }, 1000);
        }
    }
</script>

<style lang="less">
.title-bar {
    padding: 10px 5px;
    h2 {
        font-size: 17px;
        font-weight: bold;
        color: #1f5ad8;
        span {
            padding-left: 6px;
        }
    }
}
</style>