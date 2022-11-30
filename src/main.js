import Vue from 'vue'
import App from './App.vue'
import router from './router'
import iView from 'iview';
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {
    getCurDate,
    setSessionStorage,
    getSessionStorage,
    removeSessionStorage,
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage
} from './common.js'
import 'iview/dist/styles/iview.css';
Vue.use(iView);
Vue.use(ElementUI);
Vue.prototype.axios = axios;
Vue.config.productionTip = false;
//设置axios的基础url部分
axios.defaults.baseURL = 'http://192.168.43.194:8080/elm/'; //将axios挂载到vue实例上，使用时就可以 this.$axios 这样使用了 Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$getCurDate = getCurDate;
Vue.prototype.$setSessionStorage = setSessionStorage;
Vue.prototype.$getSessionStorage = getSessionStorage;
Vue.prototype.$removeSessionStorage = removeSessionStorage;
Vue.prototype.$setLocalStorage = setLocalStorage;
Vue.prototype.$getLocalStorage = getLocalStorage;
Vue.prototype.$removeLocalStorage = removeLocalStorage;
router.beforeEach(function(to,from,next){
let user = sessionStorage.getItem('user'); //除了登录、注册、首页、商家列表、商家信息之外，都需要判断是否登录 

if(!(to.path=='/'||to.path=='/index'||to.path=='/businessList'||to.path=='/businessInfo'||to.path=='/login'||to.path=='/register')){
        if(user==null){
            router.push('/login');
            location.reload();
} }
next();
});
new Vue({
  router,
  el: '#app',
  render: h => h(App)
}).$mount('#app')