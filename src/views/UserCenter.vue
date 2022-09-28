<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>我的账户</p>
    </header>
    <!-- 订单列表部分 -->
      
    <img  style="height:20vw;weight:20vw;margin-top:55vw;margin-left:40vw;" src="../assets/touxiang.png"/>
    <h2 style="text-align:center;margin-top:10vw;" >
    <img v-show="userSex" style="height:4vw;weight:4vw;" src="../assets/man.png"/>
    <img v-show="!userSex" style="height:4vw;weight:4vw;" src="../assets/women.png"/>
    {{userName}}</h2>
    
    <Button class="btn1" type="primary" @click="modal = true">修改账号信息</Button>
    <Modal
        v-model="modal"
        title="修改账号信息"
        @on-ok="ok"
        @on-cancel="cancel">
        <div style="font-size:4vw">昵称：</div>
        <Input  v-model="newName" placeholder="请输入新昵称..." style="width: 60vw" size="large"></Input>
        <div style="font-size:4vw">性别：</div>
        <Radio-group v-model="sex">
        <Radio label="1">    
            <span>男</span>
        </Radio>
        <Radio label="0">
            <span>女</span>
        </Radio>   
        </Radio-group>     
    </Modal>
    <Button class="btn2" type="primary" @click="modal1 = true">修改密码</Button>
    <Modal
        v-model="modal1"
        title="修改密码"
        @on-ok="ok1"
        @on-cancel="cancel">
                <div style="font-size:4vw">新密码：</div>
        <Input  v-model="newPassword" placeholder="请输入新密码..." style="width: 60vw" size="large"></Input>

        
    </Modal>
    <!-- 底部菜单部分 -->
    <Footer></Footer>
  </div>
</template>
<script>
import Footer from '../components/Footer.vue';
import axios from 'axios';
export default{
  name:'UserCenter',
  data(){
    return {
      modal: false,
      modal1: false,
      user:{},
      sex: "1",
      newName:"",
      userId:"",
      userName:"",
      userSex:0,
      newPassword:""
    }
  },
  created() {
    
    this.user = this.$getSessionStorage('user');
    axios.post('UserController/getUserInfoById',this.$qs.stringify({
      userId:this.user.userId,
    })).then(response=>{
      let result = response.data;
      
      this.userSex = result.userSex;
      this.userName = result.userName;
    }).catch(error=>{
      console.error(error);
    });
  },
  methods:{
    fresh(){
        this.user = this.$getSessionStorage('user');
    axios.post('UserController/getUserInfoById',this.$qs.stringify({
      userId:this.user.userId,
    })).then(response=>{
      let result = response.data;
      
      this.userSex = result.userSex;
      this.userName = result.userName;
    }).catch(error=>{
      console.error(error);
    });
    },
    ok () {
    axios.post('UserController/updateUserById',this.$qs.stringify({
      userId:this.user.userId,
      userName:this.newName,
      userSex:this.sex/1,
    })).then(this.fresh)
                this.$Message.info('修改成功');
            },
            cancel () {
                
            },
    ok1 () {
    axios.post('UserController/updateUserById',this.$qs.stringify({
      userId:this.user.userId,
      password:this.newPassword
    })).then(this.fresh)
                this.$Message.info('修改成功');
      this.$router.push({path:'/login'});
            },
  },
  
  components:{
    Footer
  }
}
</script>
<style scoped>
/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100%;
}
/****************** header部分 ******************/
.wrapper header {
  width: 100%;
  height: 12vw;
  background-color: #0097FF;
  color: #fff;
  font-size: 4.8vw;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
/****************** 历史订单列表部分 ******************/
.wrapper h3 {
  margin-top: 12vw;
  box-sizing: border-box;
  padding: 4vw;
  font-size: 4vw;
  font-weight: 300;
  color: #999;
}
.wrapper .order {
  width: 100%;
}
.wrapper .order li {
  width: 100%;
}
.wrapper .order li .order-info {
  box-sizing: border-box;
  padding: 2vw 4vw;
  font-size: 4vw;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wrapper .order li .order-info .order-info-right {
  display: flex;
}
.wrapper .order li .order-info .order-info-right .order-info-right-icon {
  background-color: #f90;
  color: #fff;
  border-radius: 3px;
  margin-left: 2vw;
  user-select: none;
  cursor: pointer;
}
.wrapper .order li .order-detailet {
  width: 100%;
}
.wrapper .order li .order-detailet li {
  width: 100%;
  box-sizing: border-box;
  padding: 1vw 4vw;
  color: #666;
  font-size: 3vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn1{
  background: linear-gradient(to bottom right, #0097FF, rgb(177, 201, 247));
  width: 80vw;
  height: 10vw;
  margin-left: 10vw;
  margin-top: 30vw;
  border-radius: 10px;
  border: 0.1px solid;
  font-size: 4vw;
  color:white;
}
.btn2{
  background: linear-gradient(to bottom right, #0097FF, rgb(177, 201, 247));
  width: 80vw;
  height: 10vw;
  margin-left: 10vw;
  margin-top: 10vw;
  border-radius: 10px;
  border: 0.1px solid;
  font-size: 4vw;
  color:white;
}
</style>