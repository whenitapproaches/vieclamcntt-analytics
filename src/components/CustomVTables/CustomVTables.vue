<template>
	<div :class="`VueTables VueTables--${props.source}`" slot-scope="props">
		<div class="columns is-vcentered">
			<div class="column">
				<div
					v-if="!props.opts.filterByColumn && props.opts.filterable"
					:class="`${props.theme.field} ${props.theme.inline} ${props.theme.left} VueTables__search`"
					class="is-fullwidth"
				>
					<vt-generic-filter class="is-fullwidth" />
				</div>
			</div>

			<vnodes :vnodes="props.slots.afterFilterWrapper" />

			<div class="column is-narrow" v-if="props.perPageValues.length > 1">
				<div
					:class="`${props.theme.field} ${props.theme.inline} ${props.theme.right} VueTables__limit`"
				>
					<vnodes :vnodes="props.slots.beforeLimit" />
					<vt-per-page-selector />
					<vnodes :vnodes="props.slots.afterLimit" />
				</div>
			</div>

			<div class="column" v-if="props.opts.pagination.dropdown && props.totalPages > 1">
				<div class="VueTables__pagination-wrapper">
					<div
						:class="`${props.theme.field} ${props.theme.inline} ${props.theme.right} VueTables__dropdown-pagination`"
					>
						<vt-dropdown-pagination />
					</div>
				</div>
			</div>

			<div
				v-if="props.opts.columnsDropdown"
				:class="`VueTables__columns-dropdown-wrapper ${props.theme.right} ${props.theme.dropdown.container}`"
			>
				<vt-columns-dropdown />
			</div>
		</div>

		<vnodes :vnodes="props.slots.beforeTable" />
		<div class="columns">
			<div class="column is-12">
				<div class="table-container is-fullwidth">
					<vt-table ref="vt_table" />
				</div>
			</div>
		</div>
		<vnodes :vnodes="props.slots.afterTable" />

		<div class="columns">
			<div class="column">
				<vt-pagination />
			</div>
		</div>
	</div>
</template>

<script>
import VtColumnsDropdown from "vue-tables-2/compiled/components/VtColumnsDropdown"
import VtDropdownPagination from "vue-tables-2/compiled/components/VtDropdownPagination"
import VtGenericFilter from "vue-tables-2/compiled/components/VtGenericFilter"
import VtPerPageSelector from "vue-tables-2/compiled/components/VtPerPageSelector"
import VtPagination from "vue-tables-2/compiled/components/VtPagination"
import VtTable from "vue-tables-2/compiled/components/VtTable"

export default {
	name: "CustomVTables",
	props: ["props"],
	components: {
		VtGenericFilter,
		VtPerPageSelector,
		VtColumnsDropdown,
		VtDropdownPagination,
		VtTable,
		VtPagination,
		vnodes: {
			functional: true,
			render: (h, ctx) => ctx.props.vnodes,
		},
	},
}
</script>