<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <div style="position:absolute;left:2vw;top:2.1vw" @click="back()">&lt;</div>
      <p>商家信息</p>
    </header>
    <!-- 商家logo部分 -->
    <body>
    <div class="business-logo">
      <img :src="business.businessImg">
    </div>
    <!-- 商家信息部分 -->
    <div class="business-info">
      <h1>{{business.businessName}}</h1>
      <p>&#165;{{business.starPrice}}起送 &#165;{{business.deliveryPrice}}配送</p>
      <p>{{business.businessExplain}}</p>
    </div>
    <!-- 食品列表部分 -->
    <Menu mode="horizontal" :theme="theme1" active-name="1" @on-select="tofc">
        <Menu-item name="1">
            <Icon type="ios-paper"></Icon>
            食品列表
        </Menu-item>
        <Menu-item name="2">
            <Icon type="ios-people"></Icon>
            评价
        </Menu-item>
    </Menu>    



    <ul class="food" v-if="fo">
      <li v-for="(item,index) in foodss[0]" :key="index">
        <div class="food-left">
          <img :src="item.foodImg">
          <div class="food-left-info">
            <h3>{{item.foodName}}</h3>
            <p>{{item.foodExplain}}</p>
            <p>&#165;{{item.foodPrice}}</p>
          </div>
        </div>
        <div class="food-right">
          <div>
            <i class="fa fa-minus-circle" @click="minus(index)" v-show="item.quantity!=0"></i>
          </div>
          <p><span v-show="item.quantity!=0">{{item.quantity}}</span></p>
          <div>
            <i class="fa fa-plus-circle" @click="add(index)"></i>
          </div>
        </div>
      </li>
      <li style="height:16vw"></li>
    </ul>
    <ul class="food" v-if="!fo">
      <li v-for="(item,index) in com" :key="index">
      <ul>
        <li>
          <img  style="height:5vw;weight:5vw;margin-top:2vw;margin-left:3vw;" src="../assets/touxiang.png"/>
        <div>{{item.userId}}</div>
        <el-rate style="width:90%;hieght:80%;"
    v-model="item.star" disabled
    :colors="colors">
  </el-rate>
        </li>
        <li>
  <div  v-if="item.content != ex" style="width:80vw;word-wrap:break-word;margin-left:4vw;">{{item.content}}</div>
    <div v-if="item.content == ex" style="width:80vw;word-wrap:break-word;margin-left:4vw;">该用户没有做出评价</div>
  </li>
  <el-divider></el-divider>
      </ul>
      
      </li>
      
      <li v-if="!fo" style="height:45vw"></li>
      
      <li style="height:16vw"></li>
    </ul>

    <!-- 购物车部分 -->
    <div class="cart"  v-if="fo">
      <div class="cart-left">
        <div class="cart-left-icon" :style="totalQuantity==0?'background-color:#505051;':'background-color:#3190E8;'">
          <i class="fa fa-shopping-cart"></i>
          <div class="cart-left-icon-quantity" v-show="totalQuantity!=0">
            {{totalQuantity}}</div>
        </div>
        <div class="cart-left-info">
          <p>&#165;{{totalPrice}}</p>
          <p>另需配送费{{business.deliveryPrice}}元</p>
        </div>
      </div>
      <div class="cart-right">
        <!-- 不够起送费 -->
        <div class="cart-right-item" v-show="totalSettle<business.starPrice"
             style="background-color: #535356;cursor: default;">
          &#165;{{business.starPrice}}起送
        </div>
        <!-- 达到起送费 -->
        <div class="cart-right-item" @click="toOrder" v-show="totalSettle>=business.starPrice">
          去结算
        </div>
      </div>
    </div>
    <div class="com"  v-if="!fo">
    <div class="com-wai">
      <span style="width:90%;hieght:80%;position:absolute;left:5%;top:5%">给商家打分吧</span>
      <el-rate style="width:90%;hieght:80%;position:absolute;left:5%;top:14%"
    v-model="value2"
    :colors="colors">
  </el-rate>
            <Input v-model="usercom" type="textarea" :rows="4" placeholder="请输入..." style="width:90%;hieght:80%;position:absolute;left:5%;top:27%"></Input>
    <Button v-if="flag == true" @click="takecom" style="width:20%;hieght:10%;position:absolute;right:5%;top:78%">提交</Button>
    <Button v-if="flag == false" style="width:20%;hieght:10%;position:absolute;right:5%;top:78%">已提交</Button>

    </div>
    </div>

    </body>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'BusinessInfo',
  data() {
    return {
      colors: ['#99A9BF', '#F7BA2A', '#FFC125'],
      businessId: this.$route.query.businessId,
      fromRouter: this.$route.query.fromRouter,
      orderTypeId: this.$route.query.orderTypeId,
      foodlist: this.$route.query.foodlist,
      ok:this.$route.query.ok,
      business: {},
      com:[],
      foodArr: [],
      user: {},
      foodss: [],
      fo:true,
      theme1: 'light',
      usercom:"",
      value2:5,
      ex:"",
      flag:true,
    }
  },
  created() {
    this.user = this.$getSessionStorage('user');
     axios.post('CommentsController/listComment', this.$qs.stringify({
      businessId: this.businessId
    })).then(response => {
      this.com = response.data;
    }).catch(error => {
      console.error(error);
    });
    
    //根据businessId查询商家信息

   axios.post('BusinessController/getBusinessById', this.$qs.stringify({
      businessId: this.businessId
    })).then(response => {
      this.business = response.data;
    }).catch(error => {
      console.error(error);
    });
    //根据businessId查询所属食品信息
    axios.post('FoodController/listFoodByBusinessId', this.$qs.stringify({
      businessId: this.businessId
    })).then(response => {
      this.foodArr = response.data;
      this.foodss.push(this.foodArr);
      for (let i = 0; i < this.foodArr.length; i++) {
        this.foodArr[i].quantity = 0;
      }
      //如果已登录，那么需要去查询购物车中是否已经选购了某个食品
      if (this.user != null) {
        this.listCart();
      }
    }).then(
      response => {
        response
        if(this.ok == 1){
          for (let foodItem of this.foodArr) {
          
          for (let cartItem of this.foodlist) {
            if (cartItem.foodId == foodItem.foodId) {
              
              this.add(this.foodArr.indexOf(foodItem));
            }
          }
        }
        }
        
      }

      
    ).catch(error => {
      console.error(error);
    });
    
  },
  methods: {
   async takecom(){
    await axios.post('CommentsController/saveComment', this.$qs.stringify({
      businessId: this.businessId,
      userId: this.user.userId,
      foodId: this.foodss[0].foodId,
      content: this.usercom,
      star: this.value2
    })).then(
      this.flag = false,
    )
    axios.post('CommentsController/listComment', this.$qs.stringify({
      businessId: this.businessId
    })).then(response => {
      this.com = response.data;
    }).catch(error => {
      console.error(error);
    });
    this.$Message.info('评论成功');
    },
    tofc(key){
        if(key==1){
this.fo = true
        }
        else{
this.fo = false
        }
    },
    back(){
      if(this.foodlist){
      for (let foodItem of this.foodArr) {
          
          for (let cartItem of this.foodlist) {
            if (cartItem.foodId == foodItem.foodId) {
              
              this.minus(this.foodArr.indexOf(foodItem));
            }
          }
      } 
      }
      if(this.fromRouter == "index"){
      this.$router.push({
          path: '/index'
        })
      }
      if(this.fromRouter == "list"){
      this.$router.push({
          path: '/businessList'+"?orderTypeId="+this.orderTypeId
        })
      }
    },
    listCart() {
      axios.post('CartController/listCart', this.$qs.stringify({
        businessId: this.businessId,
        userId: this.user.userId
      })).then(response => {
        let cartArr = response.data;
        
        //遍历所有食品列表
        for (let foodItem of this.foodArr) {
          foodItem.quantity = 0;
          for (let cartItem of cartArr) {
            if (cartItem.foodId == foodItem.foodId) {
              foodItem.quantity = cartItem.quantity;
            }
          }
        }
        this.foodArr.sort();
      }).catch(error => {
        console.error(error);
      });





    },
    add(index) {
      //首先做登录验证
      if (this.user == null) {
        this.$router.push({
          path: '/login'
        });
        return;
      }
      if (this.foodArr[index].quantity == 0) {
        //做insert
        this.savaCart(index);
      } else {
        //做update
        this.updateCart(index, 1);
      }
    },
    minus(index) {
      //首先做登录验证
      if (this.user == null) {
        this.$router.push({
          path: '/login'
        });
        return;
      }
      if (this.foodArr[index].quantity > 1) {
        //做update
        this.updateCart(index, -1);
      } else {
        //做delete
        this.removeCart(index);
      }
    },
    savaCart(index) {
      axios.post('CartController/saveCart', this.$qs.stringify({
        businessId: this.businessId,
        userId: this.user.userId,
        foodId: this.foodArr[index].foodId
      })).then(response => {
        if (response.data == 1) {
          //此食品数量要更新为1；
          this.foodArr[index].quantity = 1;
          this.foodArr.sort();
        } else {
          alert('向购物车中添加食品失败！');
        }
      }).catch(error => {
        console.error(error);
      });
    },
    updateCart(index, num) {
      axios.post('CartController/updateCart', this.$qs.stringify({
        businessId: this.businessId,
        userId: this.user.userId,
        foodId: this.foodArr[index].foodId,
        quantity: this.foodArr[index].quantity + num
      })).then(response => {
        if (response.data == 1) {
          //此食品数量要更新为1或-1；
          this.foodArr[index].quantity += num;
          this.foodArr.sort();
        } else {
          alert('向购物车中更新食品失败！');
        }
      }).catch(error => {
        console.error(error);
      });
    },
    removeCart(index) {
      axios.post('CartController/removeCart', this.$qs.stringify({
        businessId: this.businessId,
        userId: this.user.userId,
        foodId: this.foodArr[index].foodId
      })).then(response => {
        if (response.data == 1) {
          //此食品数量要更新为0；视图的减号和数量要消失
          this.foodArr[index].quantity = 0;
          this.foodArr.sort();
        } else {
          alert('从购物车中删除食品失败！');
        }
      }).catch(error => {
        console.error(error);
      });
    },
    toOrder() {
      this.$router.push({
        path: '/orders',
        query: {
          businessId: this.business.businessId,
          fromRouter: this.fromRouter,
          orderTypeId: this.orderTypeId,
          foodlist:this.foodlist,
        }
      });
    }
  },
  computed: {
    //食品总价格
    totalPrice() {
      let total = 0;
      for (let item of this.foodArr) {
        total += item.foodPrice * item.quantity;
      }
      return total;
    },
    //食品总数量
    totalQuantity() {
      let quantity = 0;
      for (let item of this.foodArr) {
        quantity += item.quantity;
      }
      return quantity;
    },
    //结算总价格
    totalSettle() {
      return this.totalPrice + this.business.deliveryPrice;
    }
  }
}
</script>
<style scoped>
/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100%;

}
@keyframes rowup {
    0% {
        opacity: 0;
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
  color: white;
  font-size: 4.8vw;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper body {
  animation: 2s rowup forwards;
}
/****************** 商家logo部分 ******************/
.wrapper .business-logo {
  width: 100%;
  height: 35vw;
  /*使用上外边距避开header部分*/
  margin-top: 12vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper .business-logo img {
  width: 40vw;
  height: 30vw;
  border-radius: 5px;
}
/****************** 商家信息部分 ******************/
.wrapper .business-info {
  width: 100%;
  height: 20vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.wrapper .business-info h1 {
  font-size: 5vw;
}
.wrapper .business-info p {
  font-size: 3vw;
  color: #666;
  margin-top: 1vw;
}
/****************** 食品列表部分 ******************/
.wrapper .food {
  width: 100%;
  /*使用下外边距避开footer部分*/
  margin-bottom: 14vw;
}
.wrapper .food li {
  width: 100%;
  box-sizing: border-box;
  padding: 2.5vw;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wrapper .food li .food-left {
  display: flex;
  align-items: center;
}
.wrapper .food li .food-left img {
  width: 20vw;
  height: 20vw;
}
.wrapper .food li .food-left .food-left-info {
  margin-left: 3vw;
}
.wrapper .food li .food-left .food-left-info h3 {
  font-size: 3.8vw;
  color: #555;
}
.wrapper .food li .food-left .food-left-info p {
  font-size: 3vw;
  color: #888;
  margin-top: 2vw;
}
.wrapper .food li .food-right {
  width: 16vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wrapper .food li .food-right .fa-minus-circle {
  font-size: 5.5vw;
  color: #999;
  cursor: pointer;
}
.wrapper .food li .food-right p {
  font-size: 3.6vw;
  color: #333;
}
.wrapper .food li .food-right .fa-plus-circle {
  font-size: 5.5vw;
  color: #0097EF;
  cursor: pointer;
}
/****************** 购物车部分 ******************/
.wrapper .cart {
  width: 100%;
  height: 14vw;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;

}
.wrapper .com {
  width: 100%;
  height: 54vw;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  
}
.wrapper .cart .cart-left {
  flex: 2;
  background-color: #505051;
  display: flex;
}
.wrapper .com .com-wai {
  flex: 2;
  background: linear-gradient(to top, #0097FF, rgb(248, 248, 248));
  display: flex;
  border-radius: 20px 20px 5px 5px;
}
.wrapper .cart .cart-left .cart-left-icon {
  width: 16vw;
  height: 16vw;
  box-sizing: border-box;
  border: solid 1.6vw #444;
  border-radius: 8vw;
  background-color: #3190E8;
  font-size: 7vw;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -4vw;
  margin-left: 3vw;
  position: relative;
}
.wrapper .cart .cart-left .cart-left-icon-quantity {
  width: 5vw;
  height: 5vw;
  border-radius: 2.5vw;
  background-color: red;
  color: #fff;
  font-size: 3.6vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: -1.5vw;
  top: -1.5vw;
}
.wrapper .cart .cart-left .cart-left-info p:first-child {
  font-size: 4.5vw;
  color: #fff;
  margin-top: 1vw;
}
.wrapper .cart .cart-left .cart-left-info p:last-child {
  font-size: 2.8vw;
  color: #AAA;
}
.wrapper .cart .cart-right {
  flex: 1;
}
/*达到起送费时的样式*/
.wrapper .cart .cart-right .cart-right-item {
  width: 100%;
  height: 100%;
  background-color: #38CA73;
  color: #fff;
  font-size: 4.5vw;
  font-weight: 700;
  user-select: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
/*不够起送费时的样式（只有背景色和鼠标样式的区别）*/
/*
.wrapper .cart .cart-right .cart-right-item{
width: 100%;
height: 100%;
background-color: #535356;
color: #fff;
font-size: 4.5vw;
font-weight: 700;
user-select: none;

display: flex;
justify-content: center;
align-items: center;
}
*/
</style>