<style lang="less">
</style>

<template>
	<div class="wau-demo-one">
		<h5>{{name}} <span @click="refresh" class="btn btn-info btn-xs">刷新列表</span></h5>
		<div class="form-control-static">
      <table class="table table-striped table-bordered table-hover">
        <thead>
          <tr><th :width="(index==2?200:120)" v-for="(thead,index) in table_header">{{thead.name}}</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id" v-if="!loading">
             <td>{{item.id}}</td>
             <td>{{item.user_name}} </td>
             <td>
	               <div class="progress pos-rel" :data-percent="toPercent(item.stock_detail)">
	                   <div class="progress-bar" :style="percentWidth(item.stock_detail)"></div>
	               </div>
             </td>
             <td>{{item.type}}</td>
          </tr>
          <tr v-if="loading">
          	<td colspan="4" class="text-center">
          		加载中...
          	</td>
          </tr>
        </tbody>
      </table>
  	</div>
	</div>
</template>

<script>
	import $ from 'jquery';

	export default {
		name: 'WauDemoOne',
		props: {
	    conf: {
	      type: Object,
	      default: function() {
	        return {};
	      }
	    }
	  },
		data(){
			return {
				name: 'wau-demo-one, 动态表格',
				table_header: this.conf.table_header,
	      request: this.conf.request,
	      list: [],
	      loading: true
			}
		},
		mounted() {
	    // console.log(this.conf);
	    this.getList();
	  },
	  methods: {
	    getList(){
	      var that = this;
	      // console.log(that.request.url)
	      that.loading = true;
	      $.ajax({
	        url: that.request.url,
	        type: 'POST',
	        dataType: 'json',
	        data: {},
	        success: function(res){
	          try{
	            that.list = res.data.list;
	          }catch(e){
	            window.WauUI.modal.notification('系统提示', res.msg, 'error');
	          }
	          setTimeout(() => {
	          	that.loading = false;
	          },1000);
	        },
	        error: function(){
	        	that.loading = false;
	          window.WauUI.modal.notification('系统提示', '网络错误', 'error');
	        }
	      })
	    },
	    toPercent(data){
	      var arr = data.split('/');
	      var percent = '0%';
	      try{
	        percent = arr[0]/arr[1]*100 + '%';
	      }catch(e){
	        percent = '0%';
	      }
	      return percent;
	    },
	    percentWidth(data){
	      var that = this;
	      return {
	        'width': that.toPercent(data)
	      };
	    },
	    refresh(){
	      this.getList();
	    }
	  }
	}
</script>