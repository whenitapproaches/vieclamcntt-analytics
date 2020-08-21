<template>
	<div class="modal delete-job">
		<div class="modal-background" @click="$emit('close')"></div>
		<div class="modal-content column is-4">
			<div class="box">
				<h1 class="title mb-6">Xóa tất cả từ khóa</h1>
				<div class="field">
					<p class="control">
						<base-button class="is-flex ml-auto is-danger" @click="$emit('confirm')">Xóa</base-button>
					</p>
				</div>
			</div>
		</div>
		<button @click="$emit('close')" class="modal-close is-large" aria-label="close"></button>
	</div>
</template>

<script>
</script>

<style scoped lang="scss">
label {
	color: var(--text-secondary-color);
}
</style>