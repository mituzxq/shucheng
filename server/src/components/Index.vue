<template>
	<div class="container">
		<div class="row mt-5">
			<div class="col-md-4">
				<div>
					<div class="list-group" id="mynav">
						<a href="#jsj" class="list-group-item">计算机</a>
						<a href="#xs" class="list-group-item">小说</a>
						<a href="#kp" class="list-group-item">科普</a>
						<a href="#tw" class="list-group-item">天文</a>
					</div>
				</div>
			</div>
			<div class="col-md-8">
				<div class="shadow" style="height: 200px;">
					<el-carousel :interval="4000" type="card" height="200px">
						<el-carousel-item v-for="(item,index) in bookData.slice(0,4)" :key="index">
							<img @click="toDetail(item.id)" :src="item.image" mode="widthFix"
								style="width: 100%;height: 250px;">
						</el-carousel-item>
					</el-carousel>
				</div>
			</div>
		</div>
		<div class="mt-5">
			<div v-if="jsj.length>0">
				<p id="jsj" class="mt-5 gdjt mb-3">
					<strong>计算机</strong>
				</p>
				<div class="row mt-3 mb-5">
					<div v-for="item in jsj" class="col-md-3 mt-2" style="text-align: center;">
						<p>书名：{{item.title}}</p>
						<img @click="toDetail(item.id)" :src="item.image" style="width: 90%;height: 150px;" alt="">
						<p>价格:<span style="color: red;">{{item.price}}￥</span></p>
					</div>
				</div>
			</div>
			<div v-if="xs.length>0">
				<p id="xs" class="mt-5 gdjt mb-3">
					<strong>小说</strong>
				</p>
				<div class="row mt-3 mb-5">
					<div v-for="item in xs" class="col-md-3 mt-2" style="text-align: center;">
						<p>书名：{{item.title}}</p>
						<img @click="toDetail(item.id)" :src="item.image" style="width: 90%;height: 150px;" alt="">
						<p>价格:<span style="color: red;">{{item.price}}￥</span></p>
					</div>
				</div>
			</div>
			<div v-if="kp.length>0">
				<p id="kp" class="mt-5 gdjt mb-3">
					<strong>科普</strong>
				</p>
				<div class="row mt-3 mb-5">
					<div v-for="item in kp" class="col-md-3 mt-2" style="text-align: center;">
						<p>书名：{{item.title}}</p>
						<img @click="toDetail(item.id)" :src="item.image" style="width: 90%;height: 150px;" alt="">
						<p>价格:<span style="color: red;">{{item.price}}￥</span></p>
					</div>
				</div>
			</div>
			<div v-if="tw.length>0">
				<p id="tw" class="mt-5 gdjt mb-3">
					<strong>天文</strong>
				</p>
				<div class="row mt-3 mb-5">
					<div v-for="item in tw" class="col-md-3 mt-2" style="text-align: center;">
						<p>书名：{{item.title}}</p>
						<img @click="toDetail(item.id)" :src="item.image" style="width: 90%;height: 150px;" alt="">
						<p>价格:<span style="color: red;">{{item.price}}￥</span></p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Carousel',
		data() {
			return {
				api: 'http://localhost:3000',
				bookData: [],
				jsj: [],
				xs: [],
				kp: [],
				tw: [],
			};
		},
		beforeMount() {
			this.fetchbookData();
		},
		methods: {
			toDetail(id) {
				this.$router.push({
					name: 'bookDetail',
					params: {
						id: id
					}
				})
			},
			fetchbookData() {
				this.axios.get('/api/carousel-data')
					.then(response => {
						this.bookData = response.data;
						for (let i in this.bookData) {
							this.bookData[i].image = this.api + this.bookData[i].image
							if (this.bookData[i].type == "计算机") {
								this.jsj.push(this.bookData[i])
							} else if (this.bookData[i].type == "小说") {
								this.xs.push(this.bookData[i])
							} else if (this.bookData[i].type == "科普") {
								this.kp.push(this.bookData[i])
							} else if (this.bookData[i].type == "天文") {
								this.tw.push(this.bookData[i])
							}
						}
					})
					.catch(error => {
						console.error(error);
					});
			}
		}
	};
</script>


<style scoped>
	.gdjt {
		color: red;
		border-bottom: 5px solid red;
		padding-bottom: 10px;
	}
</style>