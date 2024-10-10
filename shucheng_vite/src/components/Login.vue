<template>
	<div class="container">
		<form action="#" method="get" class="shadow p-4" style="margin-top: 100px;">
			<div class="form-group row mt-4 was-validated">
				<label class="col-form-label col-2 text-right offset-2">用户名:</label>
				<div class="col-5">
					<input type="text" v-model="username" placeholder="请输入用户名" class="form-control" required="required"
						pattern="[A-Za-z0-9]{1,15}" />
					<div class="invalid-feedback">
						账号不能为空
					</div>
				</div>
			</div>
			<div class="form-group row was-validated">
				<label class="col-form-label col-2 offset-2 text-right">登录密码:</label>
				<div class="col-5">
					<input type="password" v-model="password" class="form-control" placeholder="请输入密码"
						required="required" pattern="[A-Za-z0-9]{3,15}" />
					<div class="invalid-feedback">
						密码是3-15位
					</div>
				</div>
			</div>
			<div class="col-5 offset-8 mt-3" style="display: flex;">
				<span style="font-style: info;" class="text-primary"> <router-link
						to="/register">立即注册</router-link></span>
			</div>
			<div class="col-3 offset-5 mt-3 mb-3">
				<input @click="toLogin" type="button" name="send" id="" value="登录"
					class="btn btn-danger btn-block btn-lg" />
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		name: "Login",
		data() {
			return {
				username: '',
				password: ''
			};
		},
		methods: {
			toLogin() {
				if (this.username.length > 0 && this.password.length > 0) {
					this.axios.post("/login", {
							username: this.username,
							password: this.password
						})
						.then(response => {
							if (response.status === 200) {
								localStorage.setItem('userId', response.data[0].id);
								localStorage.setItem('userName', response.data[0].username);
								this.$router.replace('/');
								setTimeout(() => {
									location.reload()
								}, 100);
							} else {
								alert("用户不存在")
							}
						})
						.catch(error => {
							alert("用户不存在")
						});
				}
			},
		},
	};
</script>
<style>
	input:hover {
		color: rgb(180, 86, 9);
		border-left: solid 6px #40A46F;
	}
</style>