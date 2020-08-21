<template>
	<div class="columns is-multiline">
		<div class="column is-12">
			<div class="box">
				<TheSettingsSession />
			</div>
		</div>
		<div class="column is-12">
			<div class="box">
				<div class="columns is-vcentered">
					<div class="column is-3">
						<label class="label">
							Access Token: (lấy tại
							<a
								href="#"
								@click="openExternalLink('https://developers.facebook.com/tools/explorer/')"
							>đây</a>)
						</label>
					</div>
					<div class="column">
						<div class="field has-addons">
							<p class="control is-expanded">
								<input
									ref="accessTokenInput"
									class="input is-rounded"
									type="text"
									placeholder
									v-model="accessToken"
								/>
							</p>
							<p class="control">
								<base-button class="is-info" @click="selectAll('accessToken')">Chọn tất cả</base-button>
							</p>
						</div>
					</div>
				</div>
				<div class="columns is-vcentered">
					<div class="column is-3">
						<label class="label">Group ID:</label>
					</div>
					<div class="column">
						<div class="field has-addons">
							<p class="control is-expanded">
								<input
									ref="groupIdInput"
									class="input is-rounded"
									type="text"
									placeholder
									v-model="groupId"
								/>
							</p>
							<p class="control">
								<base-button class="is-info" @click="selectAll('groupId')">Chọn tất cả</base-button>
							</p>
						</div>
					</div>
				</div>
				<TheSettingsUpdateButton @click="updateButton" />
			</div>
		</div>
		<div class="column is-12">
			<div class="box">
				<TheSettingsGroupSettings />
			</div>
		</div>
	</div>
</template>

<script>
import TheSettingsUpdateButton from "@/components/TheSettingsUpdateButton"
import TheSettingsSession from "@/components/TheSettingsSession"
import TheSettingsGroupSettings from "@/components/TheSettingsGroupSettings"
import { shell } from "electron"
import { mapActions } from "vuex"
export default {
	components: {
		TheSettingsUpdateButton,
		TheSettingsSession,
		TheSettingsGroupSettings
	},
	computed: {
		accessToken: {
			get() {
				return this.$store.getters["Settings/accessToken"]
			},
			set(value) {
				return this.$store.commit("Settings/setAccessToken", value)
			},
		},
		groupId: {
			get() {
				return this.$store.getters["Settings/groupId"]
			},
			set(value) {
				return this.$store.commit("Settings/setGroupId", value)
			},
		},
	},
	async beforeMount() {
		await this.fetchAccessToken()
		await this.fetchGroupId()
	},
	methods: {
		...mapActions("Settings", {
			fetchAccessToken: "fetchAccessToken",
			updateAccessToken: "updateAccessToken",
			updateGroupId: "updateGroupId",
			fetchGroupId: "fetchGroupId",
		}),
		openExternalLink(link) {
			shell.openExternal(link)
		},
		updateButton() {
			this.updateGroupId(this.groupId)
			this.updateAccessToken(this.accessToken)
		},
		selectAll(input) {
			this.$refs[`${input}Input`].select()
		}
	},
}
</script>

<style>
</style>