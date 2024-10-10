<template>
	<div class="book-details mt-5">
		<el-card>
			<div slot="header" class="card-header">
				书籍详情
				<el-button v-if="istrue" @click="add()" class="add-to-cart-button float-right bg-primary"
					style="color: white;" type=" primary">
					加入购物车
					<span v-if="this.number > 0" class="cart-badge">{{ number }}</span>
				</el-button>
			</div>
			<div class="card-content">
				<el-row>
					<el-col :span="6">
						<img :src="bookData.image" alt="Book Cover" class="book-cover">
					</el-col>
					<el-col :span="2"></el-col>
					<el-col :span="16">
						<h2>{{ bookData.title }}</h2>
						<p>作者: {{ bookData.author }}</p>
						<p>价格: <span style="color: red;">{{ bookData.price }}￥</span></p>
					</el-col>
				</el-row>
				<el-divider></el-divider>
				<h3>简介</h3>
				<p>{{ bookData.description }}</p>
				<el-divider></el-divider>
				<h3>评论</h3>
				<el-form label-width="100px">
					<el-form-item label="你的评论">
						<input type="text" v-model="comment" placeholder="写下你的评论" class="form-control" />
					</el-form-item>
					<el-button class="float-right" type="primary" @click="addComment">添加评论</el-button>
				</el-form>
				<br>
				<el-divider></el-divider>
				<h4>评论列表</h4>
				<div>
					<div v-for="item, index in comments" :key="index">
						<div class="row">
							<div class="col-10">
								<span><span class="mr-2">评论人：</span>{{ item.author }}</span><br>
								<span><span class="mr-2" style="visibility: hidden;">评论人：</span>{{ item.comment
									}}</span>
								<span class="float-right m-5">{{ item.time }}</span>
							</div>
							<div v-if="this.user == item.author" class="col-2">
								<span></span><br>
								<el-button @click="delComment(index)" class="float-right" type="danger">删除</el-button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
import { baseApi } from '@/utils/request';

export default {
	data() {
		return {
			number: 0,
			user: null,
			userID: null,
			bookData: [],
			comments: [],
			comment: '',
			oldcomment: '',
			id: '',
			istrue: false
		};
	},
	beforeMount() {
		// 获取从上一个页面传过来的id值
		this.id = this.$route.params.id
		this.getDetail();
		if (localStorage.getItem('userName') != null && localStorage.getItem('userId').length != null) {
			this.user = localStorage.getItem('userName')
			this.userID = localStorage.getItem('userId')
			this.istrue = true
			this.getNumbers()
		}
	},
	methods: {
		getNumbers() {
			this.axios.post('/book/salenum', {
				userid: this.userID,
				bookid: this.id
			}).then(response => {
				this.number = response.data.row.number
			}).catch(error => { });
		},
		add() {
			this.number = this.number + 1
			this.axios.post('/book/sale', {
				userid: this.userID,
				bookid: this.id,
				number: this.number
			}).then(response => {
			}).catch(error => {
				alert("加入失败")
			});
		},
		delComment(index) {
			this.comments.splice(index, index);
			const commentString = this.comments.map(comment => `${comment.time},${comment.author},${comment.comment}`)
				.join(',');
			this.axios.post('/add/comment', {
				comments: commentString,
				id: this.id
			}).then(response => {
				this.getDetail()
			}).catch(error => {
				alert("删除失败")
			});
		},
		addComment() {
			var date = new Date()
			var time = date.toString()
			var str = time.split(' ')
			time = str[4] + ','
			let userName = this.user + ','
			var comm = this.comment + " "
			var comments = this.oldcomment + ',' + time + userName + comm
			console.log(comments)
			this.axios.post('/add/comment', {
				comments: comments,
				id: this.id
			}).then(response => {
				this.comment = ''
				this.getDetail()
			}).catch(error => {
				alert("评论失败")
			});
		},
		getDetail() {
			this.axios.get('/api/carousel-data')
				.then(response => {
					for (let i in response.data) {
						if (response.data[i].id == this.id) {
							this.bookData = response.data[i]
							this.bookData.image = baseApi + this.bookData.image
							this.oldcomment = this.bookData.comments
							this.comments = this.parseCommentString(this.bookData.comments)
						}
					}
				}).catch(error => {
					console.error(error);
				});
		},
		parseCommentString(comments) {
			const commentArray = [];
			const commentParts = comments.split(',');
			for (let i = 0; i < commentParts.length; i += 3) {
				const commentObject = {
					time: commentParts[i],
					author: commentParts[i + 1],
					comment: commentParts[i + 2]
				};
				commentArray.push(commentObject);
			}
			return commentArray;
		}
	}
};
</script>

<style scoped>
.book-details {
	max-width: 800px;
	margin: 0 auto;
}

.card-header {
	font-size: 20px;
	font-weight: bold;
}

.book-cover {
	width: 100%;
	max-width: 200px;
}

.card-content {
	padding: 20px;
}

.add-to-cart-button {
	position: relative;
}

.cart-badge {
	position: absolute;
	top: -10px;
	right: -10px;
	background-color: red;
	color: white;
	border-radius: 50%;
	padding: 4px 8px;
	font-size: 12px;
}
</style>