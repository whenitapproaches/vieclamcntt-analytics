<template>
	<div class="VueTables__search-field">
		<div class="control has-icons-left">
			<input
				class="input is-rounded"
				type="text"
				placeholder="Tìm kiếm..."
				@keyup="e=>props.search(props.opts.debounce)(e)"
				:id="`VueTables__search_${props.id}`"
				autocomplete="off"
			/>
			<base-icon class="is-left">search</base-icon>
		</div>
	</div>
</template>

<script>
export default {
	name: "MyGenericFilter",
	props: ["props"],
}
</script>