<template>
	<div class="wau-time-block">
		{{label}}{{left_time}}
	</div>
</template>

<script>
	var timer;
	export default {
		name: 'WauTimeBlock',
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
				label: this.conf.label,
      	left_time: this.conf.start_time
			}
		},
		mounted() {
	    this.resetTime(this.start_time);
	  },
	  methods: {
	    resetTime(time) {
	    	var that = this;
	      timer = setInterval(this.run, 1000);
	    },
	    run() {
	    	var arr = this.left_time.split(':');
	      var h = arr[0];
	      var m = arr[1];
	      var s = arr[2];

	      if((h == 0) && (m == 0) && (s == 0)){
	      	clearInterval(timer)
	      	return this.left_time = h + ":" + m + ":" + s;
	      }

	      --s;
	      if (s < 0) {
	        --m;
	        s = 59;
	      }
	      if (m < 0) {
	        --h;
	        m = 59
	      }
	      if (h < 0) {
	        s = 0;
	        m = 0;
	      }

	      if((h == 0) && (m == 0) && (s == 0)){
	      	clearInterval(timer)
	      }

	      if(h < 10 && (h.length != 2)){
	      	h = '0' + h;
	      }
	      if(m < 10 && (m.length != 2)){
	      	m = '0' + m;
	      }
	      if(s < 10 && (s.length != 2)){
	      	s = '0' + s;
	      }
	      this.left_time = h + ":" + m + ":" + s;
	    }
	  }
	}
</script>

<style>
	.wau-time-block{
		position: fixed;
		background: #6FB3E0;
		color: #fff;
		padding: 2px 10px;
		right: 0px;
		z-index: 999;
		top: 15px;
	}
</style>