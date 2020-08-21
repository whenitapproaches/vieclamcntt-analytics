<template>
	<div class="modal delete-job">
		<div class="modal-background" @click="$emit('close')"></div>
		<div class="modal-content column is-4">
			<div class="box">
				<h1 class="title mb-6">Xóa tất cả đơn tuyển dụng</h1>
				<div class="field">
					<p class="control">
						<base-button class="is-flex ml-auto is-danger" @click="deleteJobButton">Xóa</base-button>
					</p>
				</div>
			</div>
		</div>
		<button @click="$emit('close')" class="modal-close is-large" aria-label="close"></button>
	</div>
</template>

<script>
import { mapActions } from "vuex"
export default {
	computed: {},
	methods: {
		...mapActions("Jobs", {
			deleteAllJobs: "deleteAllJobs",
		}),
		...mapActions("Notifications", {
			createNotification: "createNotification",
		}),
		async deleteJobButton() {
			await this.deleteAllJobs({
				id: this.id,
			})
			this.createNotification({
				message: 'Xóa thành công!',
				status: 'success'
			})
			this.$emit("close")
		},
	},
}
</script>

<style scoped lang="scss">
label {
	color: var(--text-secondary-color);
}
</style>