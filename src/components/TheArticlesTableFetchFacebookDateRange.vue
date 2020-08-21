<template>
	<div>
		<DatePicker
			format="DD-MM-YYYY"
			v-model="fetchingArticlesDateRange"
			value-type="timestamp"
			input-class="date-picker mx-input"
			range
		/>
	</div>
</template>

<script>
import DatePicker from "vue2-datepicker"
export default {
	name: "TheArticlesTableLastUpdated",
	components: {
		DatePicker,
	},
	computed: {
		fetchingArticlesDateRange: {
			get() {
				return this.$store.getters["Articles/fetchingArticlesDateRange"]
			},
			set(value) {
				return this.$store.commit(
					"Articles/setFetchingArticlesDateRange",
					value
				)
			},
		},
	},
}
</script>

<style>
</style>