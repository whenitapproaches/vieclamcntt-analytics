<template>
	<div>
		<div class="columns">
			<div class="column">
				<div class="box">
					<div class="columns">
						<div class="column">
							<base-button
								class="is-success has-text-weight-bold mr-5"
								@click="saveKeywordsFile"
							>Lưu từ khóa thành file</base-button>
							<base-button class="is-info has-text-weight-bold" @click="loadKeywordsFile">Nhập file từ khóa</base-button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="columns is-multiline">
			<div class="column is-12 mb-6">
				<div class="box">
					<div class="columns">
						<div class="column">
							<h2 class="title is-3">Đơn vị tuyển dụng</h2>
							<base-button class="is-success mb-5 mr-5" @click="addItem('company')">Thêm từ khóa</base-button>
							<base-button
								class="is-danger mb-5 mr-5"
								@click="currentDeleteAllConfirm = 'company'"
							>Xóa tất cả</base-button>
							<base-button class="is-info mb-5 mr-2" @click="loadFromExcel('company')">Nhập từ file Excel</base-button>
							<base-button class="is-squared is-info" v-tooltip="{ content: tooltipCouple }">
								<base-icon>help</base-icon>
							</base-button>
						</div>
					</div>
					<v-client-table
						:data="keywords.company"
						:columns="['key', 'values', 'edit', 'remove']"
						:options="options"
					>
						<template v-slot:key="props">
							<b>{{props.row.key}}</b>
						</template>
						<template v-slot:remove="props">
							<base-button class="is-danger" @click="deleteItem('company', props.row.key)">Xóa</base-button>
						</template>
						<template v-slot:values="props">{{props.row.values | arrayFilter }}</template>
						<template v-slot:edit="props">
							<base-button
								class="is-warning"
								@click="editItem('company', {key: props.row.key, values: props.row.values})"
							>Sửa</base-button>
						</template>
					</v-client-table>
				</div>
			</div>
			<div class="column is-12 mb-6">
				<div class="box">
					<div class="columns">
						<div class="column">
							<h1 class="title">Nhu cầu tuyển dụng</h1>
							<base-button class="is-success mb-5 mr-5" @click="addItem('languages')">Thêm từ khóa</base-button>
							<base-button
								class="is-danger mb-5 mr-5"
								@click="currentDeleteAllConfirm = 'languages'"
							>Xóa tất cả</base-button>
							<base-button class="is-info mb-5 mr-2" @click="loadFromExcel('languages')">Nhập từ file Excel</base-button>
							<base-button class="is-squared is-info" v-tooltip="{ content: tooltipCouple }">
								<base-icon>help</base-icon>
							</base-button>
						</div>
					</div>
					<v-client-table
						:data="keywords.languages"
						:columns="['key', 'values', 'edit', 'remove']"
						:options="options"
					>
						<template v-slot:key="props">
							<b>{{props.row.key}}</b>
						</template>
						<template v-slot:remove="props">
							<base-button class="is-danger" @click="deleteItem('languages', props.row.key)">Xóa</base-button>
						</template>
						<template v-slot:values="props">{{props.row.values | arrayFilter }}</template>
						<template v-slot:edit="props">
							<base-button
								class="is-warning"
								@click="editItem('languages', {key: props.row.key, values: props.row.values})"
							>Sửa</base-button>
						</template>
					</v-client-table>
				</div>
			</div>
		</div>
		<div class="columns is-multiline">
			<div class="column is-6 mb-6" v-for="(field, index) in settings" :key="index">
				<div class="box is-fullheight">
					<div class="columns">
						<div class="column">
							<h1 class="title">{{options.headings[fields[index]]}}</h1>
							<base-button
								class="is-danger mb-5 mr-5"
								@click="currentDeleteAllConfirm = fields[index]"
							>Xóa tất cả</base-button>
							<base-button
								class="is-info mb-5 mr-2"
								@click="loadFromExcel(fields[index])"
							>Nhập từ file Excel</base-button>
							<base-button class="is-squared is-info" v-tooltip="{ content: tooltipSingle }">
								<base-icon>help</base-icon>
							</base-button>
							<div class="field is-grouped">
								<p class="control is-expanded mr-5">
									<input
										type="text"
										class="input is-rounded"
										v-model="input[fields[index]]"
										placeholder="Nhập từ khóa tại đây..."
									/>
								</p>
								<p class="control">
									<base-button
										@click="addSingleItem({
								field: fields[index],
								value: input[fields[index]]
							})"
										class="is-success mb-5"
									>Thêm từ khóa</base-button>
								</p>
							</div>
						</div>
					</div>
					<v-client-table :data="field" :columns="[fields[index], 'remove']" :options="options">
						<template v-slot:remove="props">
							<base-button
								class="is-danger"
								@click="deleteSingleItem(fields[index], props.row[fields[index]])"
							>Xóa</base-button>
						</template>
					</v-client-table>
				</div>
			</div>
		</div>
		<TheKeywordsDeleteAllConfirmModal
			:class="{'is-active': currentDeleteAllConfirm}"
			@close="closeDeleteAllConfirmModal"
			@confirm="removeAll(currentDeleteAllConfirm)"
		/>
		<TheKeywordsEdit
			:keyword="currentEditingKeyword"
			@close="closeEditingKeywords"
			:class="{'is-active': editingKeywordsStatus}"
		/>
		<TheKeywordsCreate @close="closeCreatingKeywords" :class="{'is-active': creatingKeywordsStatus}" />
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { findIndex, indexOf } from "lodash"
import { saveKeywordsFile, loadKeywordsFile } from "@/common/keywords"
import { loadKeywordsFromExcel } from "@/common/loadKeywordsFromExcel"
import TheKeywordsEdit from "@/components/TheKeywordsEdit"
import TheKeywordsCreate from "@/components/TheKeywordsCreate"
import TheKeywordsDeleteAllConfirmModal from "@/components/TheKeywordsDeleteAllConfirmModal"
export default {
	components: {
		TheKeywordsEdit,
		TheKeywordsCreate,
		TheKeywordsDeleteAllConfirmModal,
	},
	computed: {
		...mapGetters("Keywords", {
			keywords: "keywords",
			editingKeywordsStatus: "editingKeywordsStatus",
			creatingKeywordsStatus: "creatingKeywordsStatus",
		}),
		settings: {
			get() {
				let settings = []
				for (let field in this.keywords) {
					if (
						field === "position" ||
						field === "company" ||
						field === "languages"
					)
						continue
					let arr = this.keywords[field]
					let reduced = arr.reduce((acc, cur) => {
						return [...acc, { [field]: cur }]
					}, [])
					settings = [...settings, reduced]
				}
				return settings
			},
		},
	},
	data() {
		return {
			currentDeleteAllConfirm: "",
			tooltipCouple:
				'File Excel cần có một cột "Khóa chính" có giá trị là các khóa chính và một cột "Các từ khóa" gồm các từ khóa ngăn cách với nhau bởi dấu phẩy ", ".',
			tooltipSingle:
				'File Excel cần có một cột "Từ khóa" có giá trị là các từ khóa.',
			currentEditingKeyword: {
				key: "",
				values: [],
			},
			fields: ["prefix_quantity", "suffix_quantity", "conjunctions"],
			options: {
				sortable: ["key", "prefix_quantity", "suffix_quantity", "conjunctions"],
				headings: {
					company: "Đơn vị tuyển dụng",
					languages: "Nhu cầu tuyển dụng",
					prefix_quantity: "Tiền tố số lượng",
					suffix_quantity: "Hậu tố số lượng",
					conjunctions: "Liên từ",
					edit: "",
					remove: "",
					key: "Khóa chính",
					values: "Các từ khóa",
				},
				columnsClasses: {
					edit: "has-text-centered narrow-cell",
					remove: "has-text-centered narrow-cell",
				},
			},
			input: {
				company: "",
				languages: "",
				prefix_quantity: "",
				suffix_quantity: "",
				conjunctions: ""
			},
			company: {
				tag: "",
				tags: [],
			},
			languages: {
				tag: "",
				tags: [],
			},
			prefix_quantity: {
				tag: "",
				tags: [],
			},
			suffix_quantity: {
				tag: "",
				tags: [],
			},
			position: {
				tag: "",
				tags: [],
			},
			conjunctions: {
				tag: "",
				tags: [],
			}
		}
	},
	async beforeMount() {
		await this.fetchKeywords()
		Object.keys(this.keywords).forEach((keyword) => {
			this[keyword].tags = this.keywords[keyword].map((text) => ({
				text: text,
			}))
		})
	},
	methods: {
		closeDeleteAllConfirmModal() {
			this.currentDeleteAllConfirm = ""
		},
		...mapActions("Keywords", {
			fetchKeywords: "fetchKeywords",
			updateKeywords: "updateKeywords",
			closeEditingKeywords: "closeEditingKeywords",
			closeCreatingKeywords: "closeCreatingKeywords",
			openEditingKeywords: "openEditingKeywords",
			openCreatingKeywords: "openCreatingKeywords",
			deleteKeyword: "deleteKeyword",
		}),
		...mapActions("Notifications", {
			createNotification: "createNotification",
		}),
		async removeAll(field) {
			await this.updateKeywords({
				key: field,
				array: [],
			})
			this.closeDeleteAllConfirmModal()
			this.createNotification({
				message: "Xóa tất cả thành công!",
				status: "success",
			})
		},
		async addItem(field) {
			this.openCreatingKeywords({
				field: field,
			})
		},
		async addSingleItem({ field, value }) {
			let array = [...this.keywords[field]]
			array.push(value)
			await this.updateKeywords({
				key: field,
				array: array,
			})
			this.createNotification({
				message: "Thêm mới thành công!",
				status: "success",
			})
		},
		async deleteSingleItem(field, value) {
			let index = indexOf(this.keywords[field], value)
			await this.deleteKeyword({ field, index })
			this.createNotification({
				message: "Xóa thành công!",
				status: "success",
			})
		},
		async deleteItem(field, value) {
			let index = findIndex(this.keywords[field], { key: value })
			await this.deleteKeyword({ field, index })
			this.createNotification({
				message: "Xóa thành công!",
				status: "success",
			})
		},
		async editItem(field, value) {
			this.currentEditingKeyword = value
			this.openEditingKeywords({ field: field })
		},
		async saveKeywordsFile() {
			try {
				await saveKeywordsFile()
			} catch (error) {
				return
			}
			this.createNotification({
				message: "Lưu thành công!",
				status: "success",
			})
		},
		async loadKeywordsFile() {
			try {
				await loadKeywordsFile()
			} catch (error) {
				return
			}
			this.createNotification({
				message: "Nhập thành công!",
				status: "success",
			})

			await this.fetchKeywords()
			Object.keys(this.keywords).forEach((keyword) => {
				this[keyword].tags = this.keywords[keyword].map((text) => ({
					text: text,
				}))
			})
		},
		async loadFromExcel(field) {
			try {
				await loadKeywordsFromExcel(field)
			} catch (error) {
				if (error === "no_field_found")
					return this.createNotification({
						message: "Không tìm thấy nội dung!",
						status: "error",
					})
				return
			}
			await this.fetchKeywords()
			Object.keys(this.keywords).forEach((keyword) => {
				this[keyword].tags = this.keywords[keyword].map((text) => ({
					text: text,
				}))
			})
			this.createNotification({
				message: "Nhập thành công!",
				status: "success",
			})
		},
	},
	filters: {
		arrayFilter(val) {
			return val.join(", ")
		},
	},
}
</script>

<style>
</style>