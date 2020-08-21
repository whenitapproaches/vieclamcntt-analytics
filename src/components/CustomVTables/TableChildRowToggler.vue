<template>
	<td :tabindex="props.tabIndex" @keypress.enter="props.toggle">
		<span :class="`VueTables__child-row-toggler ${props.class()}`">
			<base-button class="is-info" @click="props.toggle">Nội dung</base-button>
		</span>
	</td>
</template>

<script>
export default {
	name: "TableChildRowToggler",
	props: ["props"],
	computed: {
		icon() {
			let reg = /.*closed/i
			let isClosed = reg.test(this.props.class())
			return isClosed ? "plus" : "minus"
		},
	},
}
</script>

<style lang="scss" scoped>
td {
	width: 1rem;
}
// .VueTables__child-row-toggler--open {
// 	color: var(--red-color);
// }
// .VueTables__child-row-toggler--closed {
// 	color: var(--green-color);
// }
</style>