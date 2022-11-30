<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>我的账户</p>
    </header>
    <!-- 订单列表部分 -->
      <body>
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
    <Button class="btn2" type="primary" @click="modal2 = true">我的钱包</Button>
    
    <Modal
        v-model="modal2"
        title="我的钱包"
        @on-ok="ok"
        @on-cancel="cancel">
    <div style="text-align: center;font-weight:1000;font-size:20px"> {{balance}} ¥</div>
    <Menu mode="horizontal" :theme="theme1" active-name="1" @on-select="tofc1">
        <Menu-item name="1">
            <Icon type="ios-paper"></Icon>
            充值和提现
        </Menu-item>
        <Menu-item name="2">
            <Icon type="ios-people"></Icon>
            交易流水
        </Menu-item>
    </Menu>
    <ul style="font-size:15px;" v-if="fo1">
      <Input v-model="fund" prefix="logo-yen" placeholder="Enter number" style="width:50vw;margin-top:5vw" />
      <Button class="btn3" type="primary" @click="fundnum">充值</Button>
      <Input  v-model="withdraw" prefix="logo-yen" placeholder="Enter number" style="width:50vw;margin-top:5vw" />
      <Button class="btn3" type="primary" @click="withdrawnum">提现</Button>
    </ul>
    <ul style="font-size:15px" v-if="!fo1">
      <li v-for="(item,index) in wallet" :key="index">
      <div style="display: inline;" v-if="item.transactionType == 2">花费</div>
      <div style="display: inline;" v-if="item.transactionType == 1">提现</div>
      <div style="display: inline;" v-if="item.transactionType == 0">充值</div>
        <div style="display: inline;">{{item.amount}}</div>
        <div style="float:right">{{item.transactionTime}}</div>
      </li>
      
    </ul>
    </Modal>
    <Button class="btn2" type="primary" @click="modal3 = true">积分查询</Button>
    <Modal
        v-model="modal3"
        title="修改密码"
       
        @on-cancel="cancel">
               <div style="text-align: center;font-weight:1000;font-size:20px"> {{totalCredit}}积分 </div>
            <Menu mode="horizontal" :theme="theme1" active-name="1" @on-select="tofc">
        <Menu-item name="1">
            <Icon type="ios-people"></Icon>
            积分赚取查询
        </Menu-item>
        <Menu-item name="2">
            <Icon type="ios-paper"></Icon>
            积分消费查询
        </Menu-item>
        

        

    </Menu>  
    <ul style="font-size:15px" v-if="fo">
      <li v-for="(item,index) in addCredit" :key="index">
      <div style="display: inline;" v-if="item.channelId == '_ORDER_'">购物</div>
      <div style="display: inline;" v-if="item.channelId == '_COMMENT_'">评论</div>
        <div style="display: inline;">获得{{item.credit}}积分</div>
        <div style="float:right">{{item.createTime}}</div>
      </li>
      
    </ul>
    <ul style="font-size:15px" v-if="!fo">
      <li v-for="(item,index) in minusCredit" :key="index">
      <div style="display: inline;" v-if="item.channelId == '_SPEND_'">花费</div>
      <div style="display: inline;" v-if="item.channelId == '_OT_'">过期</div>
        <div style="display: inline;">减少{{item.credit}}积分</div>
        <div style="float:right">{{item.createTime}}</div>
      </li>
      
    </ul>
    </Modal>
    <!-- 底部菜单部分 -->
    </body>
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
      withdrawnum:0,
      fundnum:0,
      modal: false,
      modal1: false,
      modal2: false,
      modal3: false,
      fo:true,
      fo1:true,
      user:{},
      sex: "1",
      newName:"",
      userId:"",
      userName:"",
      userSex:0,
      newPassword:"",
      totalCredit:0,
      addCredit:[],
      minusCredit:[],
      balance:"",
      wallet:[],

    }
  },
  created() {
    
    this.user = this.$getSessionStorage('user');
    axios.post('UserController/getUserInfoById',this.$qs.stringify({
      userId:this.user.userId,
    })).then(response=>{
      let result = response.data;
      this.userSex = result.userSex;
      if(result.userSex==0){
        this.sex = "0"
      }
      this.userName = result.userName;
    }).catch(error=>{
      console.error(error);
    });
    axios.get('WalletController/balance?userId='+this.user.userId,this.$qs.stringify({
    })).then(response=>{
      let result = response.data;
      this.balance = result;
    }).catch(error=>{
      console.error(error);
    });
    axios.get('CreditController/getTotalCredit?userId='+this.user.userId,this.$qs.stringify({
    })).then(response=>{
      let result = response.data;
      this.totalCredit = result;
    }).catch(error=>{
      console.error(error);
    });
    axios.get('/CreditController/getCreditByParam?userId='+this.user.userId+'&param=0',this.$qs.stringify({
    })).then(response=>{
      let result = response.data;
      this.addCredit = result;
    }).catch(error=>{
      console.error(error);
    });
    axios.get('/CreditController/getCreditByParam?userId='+this.user.userId+'&param=1',this.$qs.stringify({
    })).then(response=>{
      let result = response.data;
      this.minusCredit = result;
    }).catch(error=>{
      console.error(error);
    });
    axios.get('WalletController/transaction?userId='+this.user.userId,this.$qs.stringify({
    })).then(response=>{
      let result = response.data;
      this.wallet = result;
    }).catch(error=>{
      console.error(error);
    });
  },
  methods:{
    fund(){
      axios.post('fund?inId='+this.user.userId+'&amount'+this.fundnum+'&type='+0,this.$qs.stringify({
        
      })).then(response=>{
        console.log( response.data);
        axios.get('WalletController/balance?userId='+this.user.userId,this.$qs.stringify({
    })).then(response=>{
      let result = response.data;
      this.balance = result;
    }).catch(error=>{
      console.error(error);
    });
      }).catch(error=>{
        console.error(error);
      });
    },
    withdraw(){
      axios.post('withdraw?outId='+this.user.userId+'&amount'+this.withdrawnum+'&type='+1,this.$qs.stringify({
        
      })).then(response=>{
        console.log( response.data);
        axios.get('WalletController/balance?userId='+this.user.userId,this.$qs.stringify({
    })).then(response=>{
      let result = response.data;
      this.balance = result;
    }).catch(error=>{
      console.error(error);
    });
      }).catch(error=>{
        console.error(error);
      });
    },

    tofc(key){
        if(key==1){
this.fo = true
        }
        else{
this.fo = false
        }
    },
    tofc1(key){
        if(key==1){
this.fo1 = true
        }
        else{
this.fo1 = false
        }
    },
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
/* animation: 0.4s rowup forwards; */
}
.wrapper body {

  animation: 0.7s rowup forwards;
}
@keyframes rowup {
    0% {
        opacity: 0.4;
    }
    100% {
        opacity: 1;
    }
}
/****************** header部分 ******************/
.wrapper header {
  width: 100%;
  height: 12vw;
  background: linear-gradient(to right, #0097FF, rgb(177, 201, 247));
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
  margin-top: 20vw;
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
.btn3{
  background: linear-gradient(to bottom right, #0097FF, rgb(177, 201, 247));
  width: 20vw;
  height: 10vw;
  margin-left: 10vw;
 margin-top:5vw;
  border-radius: 10px;
  border: 0.1px solid;
  font-size: 4vw;
  color:white;
}
</style>