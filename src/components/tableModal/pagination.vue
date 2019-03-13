<template>
    <div class="vpagination">
        <span class="vptext">共 {{total}} 条</span>
        <div class="vpbox" :class="{ 'dis': currentIndex == 1 }" @click="stepBack">
            <div class="varrow arrow-left"></div>
        </div>
        <div class="vpbox" v-for="(item, index) in pageCountArr" :key="index" :class="{ 'current': currentIndex == item+1 }" @click="setCurrent(item, index)">
            <span>{{item == '...' ? item : item + 1}}</span>
        </div>
        <div class="vpbox" :class="{ 'dis': currentIndex == pageCount }" @click="stepGo">
            <div class="varrow arrow-right"></div>
        </div>
        <span class="vptext"> 跳至 </span>
        <input class="vpnum" type="number" v-model="jumpIndex" @change="jump"  />
        <span class="vptext">页</span>
    </div>
</template>

<script>
const BASE_PAGE_NUM = 1;
export default {
    name: 'VPagination',
    props: {
        pageSize: {
            type: Number,
            default: () => 10
        },
        total: {
            type: Number,
            default: () => 200
        },
        currentPage: {
            type: Number,
            default: () => 1
        },
        range: {
            type: Number,
            default: () => 4
        }
    },
    data() {
        return {
            currentIndex: this.currentPage,
            pageCountArr: [],
            jumpIndex: undefined
        }
    },
    computed: {
        pageCount() {
            return Math.ceil(this.total / this.pageSize)
        },
    },
    watch: {
        currentIndex(v, o) {
            this.$emit('changePage', v)
        },
        currentPage(v, o) {
            this.currentIndex = v
        }
    },
    methods: {
        setCurrent(item, index) {
            if (item == '...') {
                if (index == BASE_PAGE_NUM) {

                    this.setPageArr(this.currentIndex, -BASE_PAGE_NUM)
                    this.currentIndex = this.currentIndex == BASE_PAGE_NUM ? BASE_PAGE_NUM : this.currentIndex-BASE_PAGE_NUM

                } else {

                    this.setPageArr(this.currentIndex, BASE_PAGE_NUM)
                    this.currentIndex = this.currentIndex == this.pageCount ? this.pageCount : this.currentIndex+BASE_PAGE_NUM

                }
            } else {
                this.currentIndex = item + 1;
            }
        },
        setPageArr(current, change = 0) {
            current = current
            let all = Array.from({ length: this.pageCount }, (v, k) => k);
            if (all.length > this.range+1) {
                if (current < this.range+1) {
                    this.pageCountArr = [
                        ...Array.from({ length: this.range + 1 }, (v, k) => k),
                        '...',
                        all.length - 1,
                    ]
                } else if (current > all.length - this.range + 1) {
                    this.pageCountArr = [
                        0,
                        '...',
                        ...all.filter((sub, index) => index >= all.length - this.range - 1)
                    ]
                } else {
                    this.pageCountArr = [
                        0,
                        '...',
                        current - 2 + change,
                        current - 1 + change,
                        current + change,
                        '...',
                        all.length - 1,
                    ]
                }
            } else {
                this.pageCountArr = all;
            }
        },
        stepBack() {
            if (this.currentIndex > BASE_PAGE_NUM) {
                this.currentIndex -= BASE_PAGE_NUM
                this.setPageArr(this.currentIndex, 0)
            }
        },
        stepGo() {
            if (this.currentIndex < this.pageCount) {
                this.currentIndex += BASE_PAGE_NUM
                this.setPageArr(this.currentIndex, 0)
            }
        },
        jump() {
            if (this.jumpIndex > this.pageCount) {
                this.jumpIndex = this.pageCount
            }
            if (this.jumpIndex < BASE_PAGE_NUM) {
                this.jumpIndex = BASE_PAGE_NUM
            }
            this.currentIndex = parseInt(this.jumpIndex);
            this.setPageArr(this.currentIndex, 0)
        }
    },
    mounted () {
        this.setPageArr(this.currentIndex, 0)
    }
}
</script>
