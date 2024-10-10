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
			<div class="form-group row">
				<label class="col-form-label col-2 offset-2 text-right">邮箱:</label>
				<div class="col-5">
					<input v-model="email" type="email" placeholder="请输入你的邮箱" class="form-control" />
				</div>
			</div>
			<div class="col-3 offset-5">
				<input @click="toRegister" type="button" name="send" id="" value="立即注册"
					class="btn btn-danger btn-block btn-lg" style="border-radius: 50px;" />
			</div>
			<div class="col-3 offset-5 mt-3" style="text-align: center;">
				<p>已有账号? <span style="font-style: info;" class="text-primary"> <router-link
							to="/login">立即登录</router-link></span></p>
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
				password: '',
				email: ''
			};
		},
		methods: {
			toRegister() {
				if (this.username.length > 0 && this.password.length > 0 && this.email > 0) {
					this.axios.post("/register", {
							username: this.username,
							password: this.password,
							email: this.email
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
								alert("用户注册失败")
							}
						})
						.catch(error => {
							alert("用户注册失败")
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