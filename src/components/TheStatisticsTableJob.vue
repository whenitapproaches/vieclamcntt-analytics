<template>
	<div class="box">
		<div class="mb-5">
			<TheStatisticsTableCreateButton class="mr-5" @click="openCreatingJob" />
			<TheStatisticsTableJobDeleteAllButton @click="openDeletingAllJobs" />
		</div>
		<TheStatisticsTableJobDeleteAllPrompt
			@close="closeDeletingAllJobs"
			:class="{'is-active': deletingAllJobsStatus}"
		/>
		<TheStatisticsTableJobCreate :class="{'is-active': creatingJobStatus}" @close="closeCreatingJob" />
		<TheStatisticsTableJobDelete
			:id="currentDeletingJobId"
			@close="closeDeletingJob"
			:class="{'is-active': deletingJobStatus}"
		/>
		<TheStatisticsTableJobEdit
			:id="currentEditingJobId"
			:job="currentEditingJob"
			@close="closeEditingJob"
			:class="{'is-active': editingJobStatus}"
		/>
		<v-client-table ref="jobsTable" :data="jobs" :columns="columns" :options="options">
			<template v-slot:edit="props">
				<base-button class="is-warning" @click="editJobButton(props.row.id, props.row)">Sửa</base-button>
			</template>
			<template v-slot:child_row="props">
				<p class="px-6 py-4" style="white-space: pre-wrap;">{{props.row.content}}</p>
			</template>
			<template v-slot:content></template>
			<template v-slot:delete="props">
				<base-button class="is-danger" @click="deleteJobButton(props.row.id)">Xóa</base-button>
			</template>
			<template v-slot:company="props">
				<strong>{{props.row.company}}</strong>
			</template>
			<template v-slot:post_link="props">
				<base-button
					v-if="props.row.post_link"
					class="is-info mx-auto"
					@click="openExternalLink(props.row.post_link)"
				>Mở</base-button>
			</template>
			<template v-slot:languages="props">{{props.row.languages | languages_filter}}</template>
			<template v-slot:posted_date="props">{{props.row.posted_date | date_filter}}</template>
			<template v-slot:auto="props">
				<base-icon v-if="props.row.auto">done</base-icon>
			</template>
			<template v-slot:afterFilterWrapper>
				<div class="column is-narrow">
					<div class="field">
						<p class="control">
							<DatePicker
								@change="filterDateRange"
								format="DD-MM-YYYY"
								v-model="filteringDateRange"
								range
								value-type="timestamp"
								input-class="date-picker input"
							/>
						</p>
					</div>
				</div>
			</template>
		</v-client-table>
		<div class="columns">
			<div class="column is-narrow">
				<p>Tổng cộng: {{jobs.length}} bài đăng</p>
			</div>
		</div>
		<TheStatisticsTableExportToExcelButton class="mr-5" @click="exportToExcel" />
	</div>
</template>

<script>
import TheStatisticsTableCreateButton from "@/components/TheStatisticsTableCreateButton"
import TheStatisticsTableExportToExcelButton from "@/components/TheStatisticsTableExportToExcelButton"
import TheStatisticsTableJobCreate from "@/components/TheStatisticsTableJobCreate"
import TheStatisticsTableJobDelete from "@/components/TheStatisticsTableJobDelete"
import TheStatisticsTableJobEdit from "@/components/TheStatisticsTableJobEdit"
import TheStatisticsTableJobDeleteAllButton from "@/components/TheStatisticsTableJobDeleteAllButton"
import TheStatisticsTableJobDeleteAllPrompt from "@/components/TheStatisticsTableJobDeleteAllPrompt"
import DatePicker from "vue2-datepicker"
import { Event } from "vue-tables-2"
import { mapGetters, mapActions } from "vuex"
import { shell } from "electron"
import moment from "moment"

import { exportExcel } from "@/common/exportExcel"
// import {getUniqueCompanies} from '@/common/uniqueCompanies'

export default {
	components: {
		TheStatisticsTableCreateButton,
		TheStatisticsTableExportToExcelButton,
		TheStatisticsTableJobCreate,
		TheStatisticsTableJobDelete,
		TheStatisticsTableJobEdit,
		TheStatisticsTableJobDeleteAllButton,
		TheStatisticsTableJobDeleteAllPrompt,
		DatePicker,
	},
	computed: {
		...mapGetters("Jobs", {
			jobs: "jobs",
			creatingJobStatus: "creatingJobStatus",
			deletingJobStatus: "deletingJobStatus",
			editingJobStatus: "editingJobStatus",
			deletingAllJobsStatus: "deletingAllJobsStatus",
		}),
		...mapGetters("Keywords", {
			keywords: "keywords",
		}),
	},
	beforeMount() {
		this.fetchKeywords()
		this.fetchJobs()
	},
	data() {
		return {
			filteringDateRange: null,
			columns: [
				"company",
				"posted_date",
				"languages",
				"post_link",
				"auto",
				"edit",
				"delete",
			],
			options: {
				headings: {
					company: "Đơn vị tuyển dụng",
					posted_date: "Ngày đăng",
					languages: "Nhu cầu",
					post_link: "Link bài đăng",
					auto: "Tự động?",
					edit: "",
					delete: "",
				},
				texts: {
					noResults: "Không tìm thấy đơn nào",
				},
				childRowTogglerFirst: false,
				customSorting: {
					posted_date(ascending) {
						return function (a, b) {
							let lastDateA = moment(a.posted_date)
							let lastDateB = moment(b.posted_date)

							let isBefore = lastDateA.isBefore(lastDateB)
							if (ascending) return isBefore ? 1 : -1

							return !isBefore ? 1 : -1
						}
					},
					languages(ascending) {
						return function (a, b) {
							let countA = a.languages.reduce((acc, cur) => {
								return acc + cur.quantity
							}, 0)
							let countB = b.languages.reduce((acc, cur) => {
								return acc + cur.quantity
							}, 0)
							if (ascending) return countA < countB ? 1 : -1
							return countA < countB ? -1 : 1
						}
					},
					content(ascending) {
						return function (a, b) {
							let lengthA = a.content.length
							let lengthB = b.content.length
							if (ascending) return lengthA < lengthB ? 1 : -1
							return lengthA < lengthB ? -1 : 1
						}
					},
				},
				sortable: ["company", "posted_date", "languages", "auto"],
				columnsClasses: {
					auto: "has-text-centered",
					edit: "has-text-centered narrow-cell",
					delete: "has-text-centered narrow-cell",
					quantity: "has-text-centered",
					post_link: "has-text-centered",
					languages: "has-text-centered",
					posted_date: "has-text-centered",
				},
				skin: "table is-bordered is-striped is-hoverable is-fullwidth",
				customFilters: [
					{
						name: "dateRangeFilter",
						callback: function (row, query) {
							console.log("sorting")
							if (!query[0] || !query[1]) return true
							let dateStart = moment(query[0])
							let dateEnd = moment(query[1])
							let rowDate = moment(row.posted_date)
							return rowDate.isBefore(dateEnd) && rowDate.isAfter(dateStart)
						},
					},
				],
			},
			currentDeletingJobId: "",
			currentEditingJobId: "",
			currentEditingJob: {},
		}
	},
	methods: {
		...mapActions("Jobs", {
			openCreatingJob: "openCreatingJob",
			closeCreatingJob: "closeCreatingJob",
			openDeletingJob: "openDeletingJob",
			closeDeletingJob: "closeDeletingJob",
			openEditingJob: "openEditingJob",
			closeEditingJob: "closeEditingJob",
			openDeletingAllJobs: "openDeletingAllJobs",
			closeDeletingAllJobs: "closeDeletingAllJobs",
			fetchJobs: "fetchJobs",
		}),
		...mapActions("Keywords", {
			fetchKeywords: "fetchKeywords",
		}),
		async exportToExcel() {
			let filteredData = this.$refs.jobsTable.allFilteredData
			// let uniqueCompaniesKeywords = getUniqueCompanies(this.keywords.company)
			// let dataWithUniqueCompanies = filteredData.map(job => {
			// 	return {
			// 		...job
			// 	}
			// })
			let xlsData = filteredData.reduce((acc, cur) => {
				let job = []
				let date = moment(cur.posted_date).format("DD-MM-YYYY")
				cur.languages.forEach((language) => {
					language.languages.forEach((specificLanguage) => {
						job.push({
							"Đơn vị tuyển dụng": cur.company,
							"Ngày đăng": date,
							"Số lượng": language.quantity,
							"Nhu cầu tuyển dụng": specificLanguage,
							"Link bài đăng": cur.post_link,
							"Quét tự động?": cur.auto ? "Có" : "Không",
						})
					})
				})
				return [...acc, ...job]
			}, [])
			// let xlsData = filteredData.map((data) => {
			// 	let date = moment(data.posted_date).format("DD-MM-YYYY")
			// 	console.log(data.languages)
			// 	return {
			// 		"Đơn vị tuyển dụng": data.company,
			// 		"Ngày đăng": date,
			// 		"Nhu cầu tuyển dụng": data.languages.join(" "),
			// 		"Số lượng": data.quantity,
			// 		"Link bài đăng": data.post_link,
			// 		"Quét tự động?": data.auto ? "Có" : "Không",
			// 	}
			// })

			try {
				await exportExcel(xlsData)
				this.$store.dispatch("Notifications/createNotification", {
					message: "Xuất file thành công!",
					status: "success",
				})
			} catch (error) {
				console.log("")
			}
		},
		openExternalLink(link) {
			shell.openExternal(link)
		},
		deleteJobButton(id) {
			this.currentDeletingJobId = id
			this.openDeletingJob()
		},
		editJobButton(id, editingJob) {
			this.currentEditingJobId = id
			this.currentEditingJob = { ...editingJob }
			this.openEditingJob()
		},
		filterDateRange() {
			Event.$emit("vue-tables.filter::dateRangeFilter", this.filteringDateRange)
		},
	},
	filters: {
		languages_filter(val) {
			return val
				.map(
					(language) => `${language.quantity} ${language.languages.join(" ")}`
				)
				.join(", ")
		},
		date_filter(val) {
			return moment(val).format("DD-MM-YYYY")
		},
	},
}
</script>

<style lang="scss">
</style>