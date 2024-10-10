import {
	createRouter,
	createWebHistory
} from 'vue-router'

import Index from "../components/Index.vue"
import Register from "../components/Register.vue"
import Login from "../components/Login.vue"
import UserCenter from "../components/UserCenter.vue"
import uploadBook from "../components/uploadbook.vue"
import bookDetail from "../components/bookDetail.vue"
import ShoppingCart from "../components/ShoppingCart.vue"
import orderCenter from "../components/orderCenter.vue"

const routes = [{
	path: "/",
	redirect: "/index"
}, {
	path: '/index',
	name: 'index',
	component: Index
}, {
	path: '/register',
	name: 'register',
	component: Register
}, {
	path: '/login',
	name: 'login',
	component: Login
}, {
	path: '/user/center',
	name: 'usercenter',
	component: UserCenter
}, {
	path: '/upload/book',
	name: 'uploadBook',
	component: uploadBook
}, {
	path: '/book/detail/:id',
	name: 'bookDetail',
	component: bookDetail
}, {
	path: '/shopcart',
	name: 'ShoppingCart',
	component: ShoppingCart
}, {
	path: '/order/center',
	name: 'orderCenter',
	component: orderCenter
}]

const router = createRouter({
  history:createWebHistory(),
	routes
})

export default router