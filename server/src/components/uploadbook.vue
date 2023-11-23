<template>
	<div class="container">
		<h1 class="mt-4">上传图书</h1>
		<form @submit="uploadBook" enctype="multipart/form-data" class="mt-4">
			<div class="form-row">
				<div class="form-group col-md-6">
					<label for="bookTitle">图书名：</label>
					<input type="text" v-model="bookTitle" required class="form-control">
				</div>
				<div class="form-group col-md-6">
					<label for="author">作者：</label>
					<input type="text" v-model="author" required class="form-control">
				</div>
			</div>

			<div class="form-group">
				<label for="description">简介：</label>
				<textarea v-model="description" class="form-control" rows="3"></textarea>
			</div>

			<div class="form-group">
				<label for="comments">评论：</label>
				<input type="text" v-model="comments" class="form-control">
			</div>

			<div class="form-group">
				<label for="comments">价格：</label>
				<input type="number" v-model="price" class="form-control">
			</div>
			<div class="form-group">
				<label for="category">图书类别：</label>
				<select v-model="category" class="form-control">
					<option value="计算机">计算机</option>
					<option value="小说">小说</option>
					<option value="科普">科普</option>
					<option value="天文">天文</option>
				</select>
			</div>
			<div class="form-group">
				<label for="bookFile">选择图书文件：</label>
				<input type="file" @change="handleFileUpload" class="form-control-file">
			</div>

			<button type="submit" class="btn btn-primary mt-3">上传图书</button>
		</form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				bookTitle: "",
				author: "",
				description: "",
				comments: "",
				price: "",
				category: '',
				selectedFile: null
			};
		},
		methods: {
			handleFileUpload(event) {
				this.selectedFile = event.target.files[0];
			},
			async uploadBook(event) {
				event.preventDefault();
				var date = new Date()
				var time = date.toString()
				var str = time.split(' ')
				time = str[4] + ','
				var userName = localStorage.getItem('userName');
				userName = userName + ','
				var comm = this.comments.replace(/,/g, '，');
				const comments = time + userName + comm
				console.log(comments)
				const formData = new FormData();
				formData.append("bookTitle", this.bookTitle);
				formData.append("author", this.author);
				formData.append("description", this.description);
				formData.append("comments", comments);
				formData.append("price", this.price);
				formData.append("bookFile", this.selectedFile);
				formData.append("type", this.category);

				try {
					const response = await this.axios.post("/upload/book", formData, {
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					});
					alert("上传成功！");
				} catch (error) {
					console.error(error);
					alert("上传失败！");
				}
			}
		}
	};
</script>

<style scoped>

</style>