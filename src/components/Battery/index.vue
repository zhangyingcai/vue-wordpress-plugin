<template>
  <div class="battery-icon-bar">
    <div class="battery-icon__outer">
      <div class="battery-icon__inner" v-bind:style="innerstyle">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name:'Battery',
  props: {
    rate: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: '#409eff'
    },
    radius: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      myrate:this.rate,
      innerstyle: {
        backgroundColor: '',
        width: this.rate+'%',
        borderRadius: this.radius
      }
    }
  },
  watch: {
    rate: function(val){
      this.matchRate(val)
    }
  },
  created() {
    this.matchRate()
  },
  methods: {
    matchRate(val) {
      let _val = val || 0
      this.innerstyle.width = `${val}%`
      if(parseFloat(val) <= 10){
        this.innerstyle.backgroundColor = 'red' // 红色
        return
      }
      if(parseFloat(val) <= 20){
        this.innerstyle.backgroundColor = 'yellow' // 黄色
        return
      }
      this.innerstyle.backgroundColor = 'gray' // 灰色
    }
  }
}
</script>

<style scoped>
.battery-icon-bar {
    height: 20px;
    width: 44px;
    top: -1px;
    background-color: #fff;
    border: 2px solid #000;
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    position: relative;
}
.battery-icon-bar:before {
    background: #000;
    content: '';
    position: absolute;
}
.battery-icon-bar:before {
    width: 2px;
    bottom: 1px;
    right: -4px;
    top: 1px;
}
.battery-icon__outer{
  width: 38px;
  left: 1px;
  top: 5%;
  height: 90%;
  right: 1px;
  overflow: hidden;
  position: relative;
  vertical-align: middle;
}
.battery-icon__inner{
  position: absolute;
  height: 100%;
  text-align: right;
  line-height: 1;
  white-space: nowrap;
  transition: width .6s ease;
}
</style>
