<template>
	<div class="container mt-5">
		<h2 class="text-center mb-4">订单中心</h2>
		<el-divider></el-divider>
		<div class="m-5" v-for="item in orderList">
			<div class="row" style="width: 100%;margin: 0 auto;text-align: center;">
				<span class="col-4"><strong>书名:</strong>{{ item.title }}</span>
				<span class="col-4"><strong>购买数量:</strong>{{ item.number }}</span>
				<span class="col-4"><strong>总价:</strong><span style="color: red;">{{ item.totalPrice }}￥</span></span>
			</div>
		</div>
		<el-divider style="margin-top: -10px;"></el-divider>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				userId: '',
				orderList: []
			}
		},
		beforeMount() {
			this.init()
		},
		methods: {
			init() {
				let userId = localStorage.getItem("userId")
				if (userId != null) {
					this.userId = userId
					this.getOrder()
				}
			},
			getOrder() {
				this.axios.post('/get/order', {
					userId: this.userId,
				}).then(response => {
					this.orderList = response.data.row
				}).catch(error => {
					console.log("查询失败")
				});
			}
		},
	}
</script>

<style>
</style>