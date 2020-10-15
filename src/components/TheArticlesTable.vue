<template>
	<div class="box">
		<div class="columns">
			<div class="column is-narrow">
				<TheArticlesTableLastUpdated />
			</div>
		</div>
		<div class="columns">
			<div class="column is-narrow">
				<TheArticlesTableFetchFacebookDateRange />
			</div>
			<div class="column is-narrow">
				<TheArticlesTableFetchFacebookButton
					@click="fetchArticlesFromFacebookButton"
				/>
				<base-button
					class="is-squared is-info ml-3"
					v-tooltip="{ content: tooltip }"
				>
					<base-icon>help</base-icon>
				</base-button>
			</div>
		</div>
		<v-client-table :data="articles" :columns="columns" :options="options">
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
			<template v-slot:post_link="props">
				<base-button
					v-if="props.row.post_link"
					class="is-info mx-auto"
					@click="openExternalLink(props.row.post_link)"
					>Mở</base-button
				>
			</template>
			<template v-slot:scan="props">
				<base-button class="is-warning mx-auto" @click="scanArticle(props.row)"
					>PHÂN TÍCH</base-button
				>
			</template>
			<template v-slot:posted_date="props">{{
				props.row.posted_date | date_filter
			}}</template>
		</v-client-table>
		<div class="columns">
			<div class="column is-narrow">
				<p>Tổng cộng: {{ articles.length }} bài đăng</p>
			</div>
		</div>
		<div class="columns">
			<div class="column is-narrow">
				<TheArticlesTableScanButton @click="scanArticlesButton" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import moment from "moment"
import DatePicker from "vue2-datepicker"
import { Event } from "vue-tables-2"
import TheArticlesTableLastUpdated from "@/components/TheArticlesTableLastUpdated"
import TheArticlesTableFetchFacebookButton from "@/components/TheArticlesTableFetchFacebookButton"
import TheArticlesTableFetchFacebookDateRange from "@/components/TheArticlesTableFetchFacebookDateRange"
import TheArticlesTableScanButton from "@/components/TheArticlesTableScanButton"
import { shell } from "electron"

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
	name: "TheArticlesTable",
	components: {
		DatePicker,
		TheArticlesTableLastUpdated,
		TheArticlesTableFetchFacebookButton,
		TheArticlesTableFetchFacebookDateRange,
		TheArticlesTableScanButton,
	},
	data() {
		return {
			tooltip: `Thời gian quét bài đăng bắt đầu và kết thúc lúc 0 giờ của hai khoảng.
Mỗi quét lấy được khoảng 500 bài.`,
			filteringDateRange: null,
			columns: ["posted_date", "content", "post_link", "scan"],
			options: {
				headings: {
					posted_date: "Ngày đăng",
					content: "Nội dung",
					post_link: "Link bài đăng",
					scan: "",
				},
				texts: {
					noResults: "Không tìm thấy bài đăng nào",
				},
				resizableColumns: false,
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
				},
				sortable: ["posted_date", "content"],
				columnsClasses: {
					posted_date: "has-text-centered",
					post_link: "has-text-centered",
					scan: "has-text-centered narrow-cell",
				},
				customFilters: [
					{
						name: "dateRangeFilter",
						callback: function (row, query) {
							if (!query[0] || !query[1]) return true
							let dateStart = moment(query[0])
							let dateEnd = moment(query[1])
							let rowDate = moment(row.posted_date)
							return rowDate.isBefore(dateEnd) && rowDate.isAfter(dateStart)
						},
					},
				],
			},
		}
	},
	computed: {
		...mapGetters("Articles", {
			articles: "articles",
			fetchingArticlesDateRange: "fetchingArticlesDateRange",
		}),
	},
	methods: {
		filterDateRange() {
			Event.$emit("vue-tables.filter::dateRangeFilter", this.filteringDateRange)
		},
		...mapActions("Articles", {
			fetchArticlesFromFacebook: "fetchArticlesFromFacebook",
			scanArticles: "scanArticles",
			scanArticle: "scanArticle",
		}),
		...mapActions("Notifications", {
			createNotification: "createNotification",
			deleteNotification: "deleteNotification",
		}),
		async fetchArticlesFromFacebookButton() {
			this.createNotification({
				message: "Đang lấy...",
				status: "loading",
			})
			try {
				await this.fetchArticlesFromFacebook(this.fetchingArticlesDateRange)
			} catch (err) {
				this.createNotification({
					message:
						"Có lỗi xảy ra. Chắc chắn bạn nhập đúng id group và access token.",
					status: "error",
				})
			}
		},
		openExternalLink(link) {
			shell.openExternal(link)
		},
		async scanArticlesButton() {
			this.createNotification({
				message:
					"Đang phân tích..",
				status: "loading",
			})
			await delay(100)
			await this.scanArticles()
			this.$router.push({
				name: "Statistics",
			})
		},
	},
	filters: {
		languages_filter(val) {
			return val.join(" ")
		},
		date_filter(val) {
			return moment(val).format("DD-MM-YYYY")
		},
	},
}
</script>

<style>
</style>