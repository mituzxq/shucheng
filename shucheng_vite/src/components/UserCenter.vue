<template>
	<div class="container mt-5">
		<h1 class="mb-4" style="color: coral;">图书商城</h1>
		<div class="row" style="font-size: 26px;">
			<div class="col-4" style="text-align: center;">
				<p class="bg-info p-2">我的信息</p>
			</div>
			<div class="col-8">
				<p class="bg-info p-2"><span
						style="font-size: 22px;border-left: 5px solid red;padding-left: 10px;">{{ title }}</span></p>
			</div>
		</div>
		<div class="row">
			<div class="col-4">
				<ul class="list-group" id="title">
					<li class="list-group-item" @click="changeTab(0)" :class="{ 'active': activeTab === 0 }">个人信息</li>
					<li class="list-group-item" @click="changeTab(1)" :class="{ 'active': activeTab === 1 }">修改密码</li>
				</ul>
			</div>
			<div class="col-8">
				<div v-show="activeTab === 0">
					<p>用户名: {{ userList.username }}</p>
					<p>邮箱: {{ userList.email }}</p>
					<button v-if="userList.id" @click="breakUser()" class="btn btn-danger float-right">注销</button>
				</div>
				<div v-show="activeTab === 1">
					<div class="form-group row">
						<label class="col-form-label col-3">请输入密码:</label>
						<div class="col-4">
							<input type="password" v-model="pw" class="form-control" placeholder="请输入密码" />
						</div>
					</div>
					<div class="form-group row">
						<label class="col-form-label col-3">请再次输入密码:</label>
						<div class="col-4">
							<input type="password" v-model="surepw" class="form-control" placeholder="请输入密码" />
						</div>
					</div>
					<div v-if="istrue" class="col-3 offset-3 mt-3 mb-3">
						<input @click="toChangePW()" type="button" value="更改密码"
							class="btn btn-danger btn-block btn-lg" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			activeTab: 0,
			title: '个人信息',
			userList: [],
			pw: '',
			surepw: '',
			istrue: false
		};
	},
	beforeMount() {
		const userId = localStorage.getItem('userId');
		const userName = localStorage.getItem('userName');
		if (userId != null && userName != null) {
			this.getInfo(userId)
			this.istrue = true
		}
	},
	methods: {
		changeTab(index) {
			this.activeTab = index;
			var title = document.getElementById("title").getElementsByTagName("li");
			this.title = title[index].innerHTML
		},
		breakUser() {
			if (confirm("确认注销")) {
				this.axios.post('/breakuser', {
					id: this.userList.id,
				})
					.then(response => {
						alert("注销成功")
						localStorage.removeItem('userId');
						localStorage.removeItem('userName');
						this.$router.replace('/');
						setTimeout(() => {
							location.reload()
						}, 100);
					})
					.catch(error => {
						alert("注销失败")
					});
			}
		},
		toChangePW() {
			if (this.pw.length != 0 && this.surepw.length != 0 && this.pw == this.surepw) {
				const requestData = {
					id: this.userList.id,
					password: this.surepw
				};
				this.axios.post('/change/password', requestData)
					.then(response => {
						alert("密码更改成功")
					})
					.catch(error => {
						alert("密码更改失败")
					});
			} else {
				alert("错误")
			}
		},
		getInfo(userId) {
			const params = {
				userId: userId
			};
			this.axios.get("/userInfo", {
				params: params
			}).then(response => {
				this.userList = response.data[0]
			}).catch(error => {
				console.error(error);
			});
		}
	}
};
</script>