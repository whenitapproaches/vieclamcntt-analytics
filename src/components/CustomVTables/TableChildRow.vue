<template>
	<tr :class="`VueTables__child-row ${props.class}`">
		<td class="childRow__container" :colspan="props.colspan">
			<div class="childRow__content" :colspan="props.colspan">
				<vnodes :vnodes="props.childRow" />
			</div>
		</td>
	</tr>
</template>

<script>
export default {
	name: "TableChildRow",
	props: ["props"],
	components: {
		vnodes: {
			functional: true,
			render: (h, ctx) => ctx.props.vnodes
		}
	},
	updated() {
	}
}
</script>

<style lang="scss" scoped>
.childRow__content {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
}
.childRow__container {
	position: relative;
	display: table-cell;
	padding: 0;
	overflow: hidden;
}
</style>