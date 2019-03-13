<!-- 单文件Vue混合组件示例 -->

<template>
	<div class="wau-test">
		姓名{{name}}
	</div>
</template>

<script>
	export default {
		/**
		 * vue组件的name定义
		 */
		name: 'WauVueTest',
		/**
		 * props的写法目前只能这么写，暂时不建议做任何修改
		 */
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
			console.log(this.conf);
			return {
				name: this.conf.name
			}
		}
		/**
		 * 其他vue相关的方法可以按需自行使用
		 */
	}
</script>

<style lang="less">
	.wii-test{
		color: #358ccc;
		font-size: 16px;
	}
</style>