<template>
	<div class="modal create-job">
		<div class="modal-background" @click="$emit('close')"></div>
		<div class="modal-content column is-9">
			<div class="box">
				<h1 class="title mb-6">Tạo mới đơn tuyển dụng</h1>
				<base-message v-show="creatingJobError.message">{{creatingJobError.message}}</base-message>
				<div class="field is-horizontal">
					<div class="field-label is-normal">
						<label class="label">Đơn vị tuyển dụng</label>
					</div>
					<div class="field-body">
						<div class="field">
							<p class="control">
								<v-suggest
									:data="keywords.company"
									show-field="key"
									v-model="job.company"
									input-class="input is-rounded"
									class="is-fullwidth"
								></v-suggest>
							</p>
						</div>
					</div>
				</div>
				<div class="field is-horizontal">
					<div class="field-label is-normal">
						<label class="label">Đơn vị tuyển dụng</label>
					</div>
					<div class="field-body">
						<div class="field">
							<p class="control">
								<DatePicker
									v-model="job.posted_date"
									format="DD-MM-YYYY"
									value-type="timestamp"
									input-class="date-picker input"
								/>
							</p>
						</div>
					</div>
				</div>
				<div class="field is-horizontal">
					<div class="field-label is-normal">
						<label class="label">Nhu cầu</label>
					</div>
					<div class="field-body">
						<div class="field">
							<div
								class="columns is-vcentered"
								v-for="(nth, index) in job.languages.length"
								:key="`languages${nth}`"
							>
								<div class="column is-narrow">
									<input
										class="input is-rounded"
										:class="{'is-danger': creatingJobError.path === `languages[${index}].quantity`}"
										type="text"
										placeholder
										v-model="job.languages[index].quantity"
										:style="{width: '4rem'}"
									/>
								</div>
								<div class="column is-narrow">
									<vue-tags-input
										v-model="tags[index]"
										:tags="job.languages[index].languages"
										:autocomplete-items="filteredAutoCompleteItems[index]"
										@tags-changed="newTags => job.languages[index].languages = newTags"
										:add-on-blur="false"
										:add-only-from-autocomplete="true"
										placeholder
									></vue-tags-input>
								</div>
								<div class="column is-narrow">
									<base-button class="is-info is-squared" @click="removeLanguagesInput(index)">
										<base-icon>remove_circle</base-icon>
									</base-button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="field is-horizontal">
					<div class="field-label is-normal"></div>
					<div class="field-body" v-if="job.languages">
						<div class="field">
							<base-button class="is-info is-squared" @click="addNewLanguagesInput">
								<base-icon>add_circle</base-icon>
							</base-button>
						</div>
					</div>
				</div>
				<div class="field is-horizontal">
					<div class="field-label is-normal"></div>
					<div class="field-body" v-if="job.languages">
						<div class="field">
							<p class="help">Gõ Enter để thêm từng nhu cầu</p>
						</div>
					</div>
				</div>
				<div class="field is-horizontal">
					<div class="field-label is-normal">
						<label class="label">Link bài đăng</label>
					</div>
					<div class="field-body">
						<div class="field">
							<p class="control">
								<input
									class="input is-rounded"
									:class="{'is-danger': creatingJobError.path === 'post_link'}"
									type="text"
									placeholder
									v-model="job.post_link"
								/>
							</p>
						</div>
					</div>
				</div>
				<div class="field mt-6">
					<p class="control">
						<base-button class="is-flex ml-auto is-success" @click="createJobButton">Lưu</base-button>
					</p>
				</div>
			</div>
		</div>
		<button @click="$emit('close')" class="modal-close is-large" aria-label="close"></button>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import DatePicker from "vue2-datepicker"
import VueTagsInput from "@johmun/vue-tags-input"
export default {
	data() {
		return {
			tags: [],
			job: {
				company: "",
				languages: [
					{
						languages: [],
						quantity: 1,
					},
				],
				post_link: "",
				posted_date: Date.now(),
			},
		}
	},
	components: {
		DatePicker,
		VueTagsInput,
	},
	computed: {
		...mapGetters("Jobs", {
			creatingJobError: "creatingJobError",
		}),
		...mapGetters("Keywords", {
			keywords: "keywords",
		}),
		keywords_languages: {
			get() {
				let languages = this.keywords.languages.map((language) => language.key)
				return languages.map((language) => ({ text: language }))
			},
		},
		filteredAutoCompleteItems() {
			return this.tags.map((tag) =>
				this.keywords_languages.filter((i) => {
					return i.text.toLowerCase().indexOf(tag.toLowerCase()) !== -1
				})
			)
		},
	},
	methods: {
		...mapActions("Jobs", {
			createJob: "createJob",
		}),
		...mapActions("Notifications", {
			createNotifcation: "createNotification",
		}),
		autocompleteCompanies(val) {
			this.job.company = val
			this.companiesKeywords = this.keywords.languages.filter((com) => {
				return com.key.indexOf(this.job.company.toLowerCase()) !== -1
			})
		},
		async createJobButton() {
			let languages = this.job.languages.map((language) => ({
				languages: language.languages.map((language) => language.text),
				quantity: language.quantity,
			}))
			await this.createJob({
				company: this.job.company,
				languages: languages,
				post_link: this.job.post_link,
				posted_date: this.job.posted_date,
			})
			if (!this.creatingJobError.message) {
				this.job = {
					company: "",
					languages: [
						{
							languages: [],
							quantity: 1,
						},
					],
					post_link: "",
					posted_date: Date.now(),
				}
				await this.createNotifcation({
					message: "Tạo mới thành công!",
					status: "success",
				})
			}
		},
		addNewLanguagesInput() {
			this.job.languages.push({
				languages: [],
				quantity: 1,
			})
		},
		removeLanguagesInput(index) {
			this.job.languages.splice(index, 1)
		},
	},
}
</script>

<style scoped lang="scss">
label {
	color: var(--text-secondary-color);
}
</style>