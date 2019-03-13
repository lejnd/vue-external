import uuidMixin from './mixin_uuid';

export default {
    props: {
        conf: [Object, Array],
        data: [Object, Array],
        request: [Object, Array]
    },
    mixins:[uuidMixin],
    computed: {
        dirty() {
            return !this.prisine
        },
        invalid() {
            return !this.valid
        }
    },
    watch: {
        value(newVal) {
            if (this.prisine === true) {
                this.prisine = false
            }
            if (!this.handleChangeEvent) {
                this.$emit('on-change', newVal)
                this.$emit('input', newVal)
            }
        }
    },
    data() {
        return {

        }
    }
}
