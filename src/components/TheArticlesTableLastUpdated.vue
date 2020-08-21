<template>
	<div>
		<p>Lần cuối quét: {{lastArticlesUpdated | date_filter }}</p>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import moment from 'moment'
export default {
	name: "TheArticlesTableLastUpdated",
	computed: {
		...mapGetters("Articles", {
			lastArticlesUpdated: "lastArticlesUpdated",
		}),
	},
	async beforeMount() {
		await this.fetchLastArticlesUpdated()
  },
  methods: {
    ...mapActions("Articles", {
      fetchLastArticlesUpdated: "fetchLastArticlesUpdated"
    })
  },
	filters: {
		date_filter(val) {
			return moment(val).format("HH:mm DD-MM-YYYY")
		},
	},
}
</script>

<style>
</style>