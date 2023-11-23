<template>
	<div>
		<header>
			<nav>
				<span>欢迎使用</span>
				<ul>
					<li><router-link to="/index">首页</router-link></li>
					<template v-if="!isLogin">
						<li>
							<router-link to="/login">登录</router-link>
						</li>
						<li><router-link to="/register">注册</router-link></li>
					</template>
					<template v-else>
						<li><a href="#">欢迎您:<span>{{userName}}</span></a></li>
						<li><a href="#" @click="toClose()">退出</a></li>
					</template>
					<li><router-link to="/user/center">用户中心</router-link></li>
					<li><router-link to="/shopcart">购物车</router-link></li>
					<li><router-link to="/order/center">我的订单</router-link></li>
				</ul>
			</nav>
		</header>
	</div>
</template>

<script>
	export default {
		name: 'Navbar',
		data() {
			return {
				isLogin: false,
				userName: null
			};
		},
		methods: {
			toClose() {
				localStorage.removeItem('userId');
				localStorage.removeItem('userName');
				this.isLogin = false
			}
		},
		beforeMount() {
			const userId = localStorage.getItem('userId');
			const userName = localStorage.getItem('userName');
			if (userId != null && userName != null) {
				this.isLogin = true
				this.userName = userName
			}
		}
	}
</script>

<style scoped>
	* {
		margin: 0;
		padding: 0;
	}

	header {
		background-color: #f0f0f0;
		padding: 10px 0;
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
		margin: 0 15%;
	}

	nav ul {
		list-style-type: none;
	}

	nav li {
		display: inline-block;
		margin-right: 10px;
		padding-right: 10px;
		border-right: 1px solid #ccc;
	}

	nav li:last-child {
		margin-right: 0;
		border-right: none;
	}

	nav router-link {
		text-decoration: none;
		color: #333;
	}

	nav router-link:hover {
		color: #ff0000;
	}
</style>