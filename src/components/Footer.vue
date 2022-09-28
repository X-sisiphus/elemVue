<template>
  <ul class="footer">
    <div :class="{'yuan1':flag1,'yuan2':flag2,'yuan3':flag3,'yuan4':flag4}"></div>
    <li @click="toIndex" :class="{'pick':flag1,'unpick':flag2,'unpick':flag3,'unpick':flag4}">
      <i class="fa fa-home"></i>
      <p>首页</p>
    </li>
    <li  class="unpick">
      <i class="fa fa-compass"></i>
      <p>发现</p>
    </li>
    <li @click="toOrderList"  :class="{'unpick':flag1,'unpick':flag2,'pick':flag3,'unpick':flag4}">
      <i class="fa fa-file-text-o"></i>
      <p>订单</p>
    </li>
    <li @click="toUserCenter"  :class="{'unpick':flag1,'unpick':flag2,'unpick':flag3,'pick':flag4}">
      <i class="fa fa-user-o"></i>
      <p>我的</p>
    </li>
  </ul>
</template>
<script>
export default{
  name:'FooterItem',
  data(){
    return {
      flag1:true,
      flag2:false,
      flag3:false,
      flag4:false,
    }
  },
  created() {
      if(this.$route.fullPath == "/UserCenter"){
      this.flag1=false;
      this.flag2=false;
      this.flag3=false;
      this.flag4=true;
      }
      if(this.$route.fullPath == "/index"){
      this.flag1=true;
      this.flag2=false;
      this.flag3=false;
      this.flag4=false;
      }
      if(this.$route.fullPath == "/orderList"){
      this.flag1=false;
      this.flag2=false;
      this.flag3=true;
      this.flag4=false;
      }
  },
  methods:{
    toIndex(){
      this.$router.push({path:'/index'});

    },
    toOrderList(){
      this.$router.push({path:'/orderList'});

    },
    toUserCenter(){
     
      this.$router.push({path:'/UserCenter'}); 

    }
  }
}
</script>
<style>
.yuan1 {
z-index: 0;

  background: #0097FF;
-moz-border-radius: 50px;
-webkit-border-radius: 50px;
border-radius: 50px;
position: absolute;
left:6.95vw;
top: 1vw;
animation: 0.7s rowup forwards;
}
.yuan2 {
z-index: 0;
  background: #0097FF;
-moz-border-radius: 50px;
-webkit-border-radius: 50px;
border-radius: 50px;
position: absolute;
left:32.2vw;
top: 1vw;
}
.yuan3 {
z-index: 0;

  background: #0097FF;
-moz-border-radius: 50px;
-webkit-border-radius: 50px;
border-radius: 50px;
position: absolute;
right:32.2vw;
top: 1vw;
animation: 0.7s rowup forwards;

}
@keyframes rowup {
    0% {
        width: 0vw;
height: 0vw;
    }
    100% {
        width: 11vw;
height: 11vw;
    }
}
.yuan4 {
z-index: 0;

  background: #0097FF;
-moz-border-radius: 50px;
-webkit-border-radius: 50px;
border-radius: 50px;
position: absolute;
right:6.95vw;
top: 1vw;
animation: 0.7s rowup forwards;
}
.wrapper .footer {
  width: 100%;
  height: 14vw;
  border-top: solid 1px #DDD;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.pick{
  /*li本身的尺寸完全由内容撑起*/
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  user-select: none;
  cursor: pointer;
}
.unpick{
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
  user-select: none;
  cursor: pointer;
}
.wrapper .footer li p {
  font-size: 2.8vw;
}
.wrapper .footer li i {
  font-size: 5vw;
}
</style>