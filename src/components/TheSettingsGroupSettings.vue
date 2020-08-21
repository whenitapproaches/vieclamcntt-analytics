<template>
	<div>
		<!-- <div class="columns is-vcentered">
			<div class="is-3 column">
				<b>Quản trị nhóm duyệt bài:</b>
			</div>
			<div class="column">
				<vue-tags-input
					v-model="groupModeratorsTag"
					:tags="computedGroupModeratorTags"
					@tags-changed="newGroupModeratorsTags => groupModeratorsTags = newGroupModeratorsTags.map(tag => tag.text)"
					:add-on-blur="false"
					placeholder
				></vue-tags-input>
			</div>
		</div>-->
		<div class="columns is-vcentered">
			<div class="is-3 column">
				<b>Từ khóa báo đã xóa:</b>
			</div>
			<div class="column">
				<vue-tags-input
					v-model="groupDeleteKeywordsTag"
					:tags="computedGroupDeleteKeywordsTags"
					@tags-changed="newGroupDeleteKeywordsTags => groupDeleteKeywordsTags = newGroupDeleteKeywordsTags.map(tag => tag.text)"
					:add-on-blur="false"
					placeholder
				></vue-tags-input>
			</div>
			<div class="is-narrow column">
				<base-button class="is-squared is-info" v-tooltip="{ content: tooltip }">
					<base-icon>help</base-icon>
				</base-button>
			</div>
		</div>
		<TheSettingsUpdateButton @click="updateButton" />
	</div>
</template>

<script>
import VueTagsInput from "@johmun/vue-tags-input"
import { mapGetters, mapActions } from "vuex"
import TheSettingsUpdateButton from "@/components/TheSettingsUpdateButton"
export default {
	components: {
		VueTagsInput,
		TheSettingsUpdateButton,
	},
	data() {
		return {
			tooltip:
				"Vì Facebook Graph API không trả về được các bài đăng đã xóa nên bộ phận kiểm duyệt trước khi xóa bài đăng nên bình luận các từ khóa ở đây.",
			groupModeratorsTag: "",
			groupDeleteKeywordsTag: "",
			groupModeratorsTags: [],
			groupDeleteKeywordsTags: [],
		}
	},
	computed: {
		...mapGetters("Groups", {
			groupModerators: "groupModerators",
			groupDeleteKeywords: "groupDeleteKeywords",
		}),
		computedGroupModeratorTags: {
			get() {
				if (!this.groupModerators) return []
				return this.groupModerators.map((val) => ({ text: val }))
			},
		},
		computedGroupDeleteKeywordsTags: {
			get() {
				if (!this.groupDeleteKeywords) return []
				return this.groupDeleteKeywords.map((val) => ({ text: val }))
			},
		},
	},
	methods: {
		...mapActions("Groups", {
			updateGroupModerators: "updateGroupModerators",
			updateGroupDeleteKeywords: "updateGroupDeleteKeywords",
			fetchGroupSettings: "fetchGroupSettings",
		}),
		...mapActions("Notifications", {
			createNotification: "createNotification",
		}),
		async updateButton() {
			console.log(this.groupDeleteKeywordsTags)
			console.log(this.groupModeratorsTags)
			await this.updateGroupDeleteKeywords([...this.groupDeleteKeywordsTags])
			await this.updateGroupModerators([...this.groupModeratorsTags])
			this.createNotification({
				status: "success",
				message: "Cập nhật thành công!",
			})
		},
	},
	mounted() {
		this.fetchGroupSettings()
	},
}
</script>

<style>
</style>