<template>
	<div>
		<h1 class="title">Phiên làm việc</h1>
		<base-button
			@click="saveSession"
			class="is-success has-text-weight-bold mr-5"
			>Lưu phiên làm việc</base-button
		>
		<base-button @click="loadSession" class="is-info has-text-weight-bold"
			>Mở phiên làm việc</base-button
		>
		<base-button
			class="is-squared is-info ml-2"
			v-tooltip="{ content: tooltip }"
		>
			<base-icon>help</base-icon>
		</base-button>
	</div>
</template>

<script>
import { saveSession, loadSession } from "@/common/session"
import { mapActions } from "vuex"
export default {
	data() {
		return {
			tooltip:
				"Phiên làm việc bao gồm các thiết lập cài đặt, từ khóa, các thông tin thống kê.",
		}
	},
	methods: {
		...mapActions("Notifications", {
			createNotification: "createNotification",
		}),
		async saveSession() {
			try {
				await saveSession()
				this.createNotification({
					status: "success",
					message: "Lưu thành công!",
				})
			} catch (err) {
				console.log(err)
				return
			}
		},
		async loadSession() {
			try {
				await loadSession()
			} catch (error) {
				return
			}
			this.createNotification({
				status: "success",
				message: "Mở thành công!",
			})
			setTimeout(() => {
				location.reload()
				this.$router.push({
					name: "Statistics",
				})
			}, 500)
		},
	},
}
</script>

<style>
</style>