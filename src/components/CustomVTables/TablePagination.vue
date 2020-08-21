<template>
	<paginate
		:pageCount="pages"
		v-model="props.page"
		:page-range="3"
		prev-text="<"
		next-text=">"
		container-class="pagination-list mt-5"
		active-class="is-active"
		disabled-class="is-disabled"
		:click-handler="page => props.setPage(page)"
		:first-last-button="false"
		:hide-prev-next="true"
	>
	</paginate>
</template>

<script>
import Paginate from "vuejs-paginate"
export default {
	name: "CustomPagination",
	props: ["props"],
	components: {
		Paginate,
	},
	computed: {
		pages() {
			return Math.ceil(this.props.records / this.props.perPage)
		},
	},
}
</script>

<style lang="scss">
.pagination-list {
	margin-top: 1.5rem;
	justify-content: center;
	li {
		padding: 0 1.5rem;
		&.is-active {
			a {
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 2.5rem;
				height: 2.5rem;
				color: var(--yellow-color);
				background-color: var(--background-yellow-color);
			}
		}
		a {
			transition: 0.3s ease;
			&:hover {
				color: var(--yellow-color);
			}
			color: var(--text-secondary-color);
			font-size: 1.25rem;
			&:focus {
				outline: none;
			}
		}
	}
}
</style>