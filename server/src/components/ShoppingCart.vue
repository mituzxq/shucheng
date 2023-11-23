<template>
	<div class="container mt-5">
		<h2 class="text-center mb-4">购物车</h2>
		<el-divider></el-divider>
		<div class="row" v-for="(item, index) in bookData" :key="index">
			<div class="col-md-3 offset-2">
				<div>
					<div class="mb-4">
						<div class="row">
							<div class="col-9">
								<img :src="this.api+item.image" class="book-image img-fluid" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-3">
				<div class="mb-4">
					<div class="card-body">
						<div class="card-text">
							<p><strong>书名:</strong>{{ item.title }}</p>
							<p><strong>数量:</strong> {{ item.number }}</p>
							<p><strong>单价:</strong> {{ item.price }}￥</p>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-2">
				<div class="mb-4">
					<div class="card-body">
						<div class="card-text">
							<p style="visibility:hidden">1</p>
							<p style="visibility:hidden">1</p>
							<p><strong>总价：</strong><span style="color: red;">{{ item.number*item.price }}￥</span></p>
						</div>
					</div>
				</div>
			</div>
			<el-divider style="margin-top: -10px;"></el-divider>
		</div>
		<div style="text-align: right;">
			<p class="mr-1"><strong>总计：</strong><span style="color: red;">{{allprice}}￥</span></p>
			<el-button @click="accounts()" class="float-right mb-5" type="danger">结算</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				api: 'http://localhost:3000',
				userId: '',
				salesDetail: [],
				bookData: [],
				allprice: 0
			};
		},
		beforeMount() {
			this.init()
			this.togetDetails()
		},
		methods: {
			accounts() {
				if (confirm("确认付款")) {
					this.toorderCenter()
					this.toClearOrder()
					this.bookData = []
					this.allprice = 0
					alert("已付款，如要查看详情请，前往订单中心！")
				} else {
					alert("已取消付款")
				}
			},
			toClearOrder() {
				this.axios.post('/clear/order', {
						userId: this.userId
					})
					.then(response => {
						console.log(ok);
					})
					.catch(error => {
						console.error(error);
					});
			},
			toorderCenter() {
				for (let i in this.bookData) {
					let data = {
						userId: this.userId,
						bookId: this.bookData[i].id,
						title: this.bookData[i].title,
						number: this.bookData[i].number,
						total: this.bookData[i].price * this.bookData[i].number,
					};
					this.axios.post('/order/center', data)
						.then(response => {
							console.log(ok);
						})
						.catch(error => {
							console.error(error);
						});
				}
			},
			init() {
				let userId = localStorage.getItem("userId")
				if (userId != null) {
					this.userId = userId
				}
			},
			togetDetails() {
				this.axios.post('/sales', {
					userId: this.userId,
				}).then(response => {
					//获取了该用户下购物车的情况
					this.salesDetail = response.data.row
					let bookids = []
					for (let i in this.salesDetail) {
						bookids.push(this.salesDetail[i].bookid)
					}
					this.toBookDetails(bookids)
				}).catch(error => {
					console.log("查询失败")
				});
			},
			toBookDetails(bookids) {
				this.axios.get('/api/carousel-data')
					.then(response => {
						let bookset = []
						let j = 0
						for (let i in response.data) {
							if (response.data[i].id == bookids[j]) {
								response.data[i].number = this.salesDetail[j].number
								if (bookids.length == j)
									break
								j++
								bookset.push(response.data[i])
							}
						}
						for (let i in bookset) {
							this.allprice += bookset[i].price * bookset[i].number
						}
						this.bookData = bookset
					}).catch(error => {
						console.error(error);
					});
			}
		},
	};
</script>

<style>
</style>