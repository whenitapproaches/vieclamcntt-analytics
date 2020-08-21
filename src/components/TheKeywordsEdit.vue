<template>
	<div class="modal edit-job">
		<div class="modal-background" @click="$emit('close')"></div>
		<div class="modal-content column is-9">
			<div class="box">
				<h1 class="title mb-6">Chỉnh sửa đơn từ khóa</h1>
				<div class="field is-horizontal">
					<div class="field-label is-normal">
						<label class="label">Khóa chính</label>
					</div>
					<div class="field-body">
						<div class="field">
							<p class="control">
								<input class="input is-rounded" type="text" placeholder v-model="keyword.key" />
							</p>
						</div>
					</div>
				</div>
				<div class="field is-horizontal">
					<div class="field-label is-normal">
						<label class="label">Các từ khóa</label>
					</div>
					<div class="field-body">
						<div class="field">
							<p class="control">
								<vue-tags-input
									v-model="tag"
									:tags="valuesTags"
									@tags-changed="newTags => keyword.values = newTags.map(tag => tag.text)"
									:add-on-blur="false"
									placeholder
								></vue-tags-input>
							</p>
							<p class="help">Gõ Enter để thêm từng từ khóa</p>
						</div>
					</div>
				</div>
				<div class="field mt-6">
					<p class="control">
						<base-button class="is-flex ml-auto is-success" @click="editingKeywordsButton">Lưu</base-button>
					</p>
				</div>
			</div>
		</div>
		<button @click="$emit('close')" class="modal-close is-large" aria-label="close"></button>
	</div>
</template>

<script>
import { mapActions } from "vuex"
import VueTagsInput from "@johmun/vue-tags-input"

export default {
	components: {
		VueTagsInput,
	},
	props: {
		keyword: {
			type: Object,
			required: true,
		},
	},
	computed: {
		valuesTags: {
			get() {
				if (this.keyword.values.length === 0) return []
				let a = this.keyword.values.map((value) => ({ text: value }))
				return a
			},
		},
	},
	data() {
		return {
			tag: "",
		}
	},
	methods: {
		...mapActions("Keywords", {
			editKeyword: "editKeyword",
		}),
		...mapActions("Notifications", {
			createNotification: "createNotification",
		}),
		async editingKeywordsButton() {
			await this.editKeyword({
				field: this.keyword.key,
				values: this.keyword.values,
			})
			this.createNotification({
				message: "Sửa đổi thành công",
				status: "success",
      })
      this.$emit('close')
		},
	},
}
</script>

<style scoped lang="scss">
label {
	color: var(--text-secondary-color);
}
</style>