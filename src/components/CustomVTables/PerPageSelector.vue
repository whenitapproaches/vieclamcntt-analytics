<template>
	<div class="VueTables__limit-field">
		<!-- <label :class="props.labelClass" :for="`VueTables__limit_${props.id}`">{{props.display('limit')}}</label> -->
		<div class="select is-rounded">
			<select
				:id="props.selectAttrs.id"
				:class="props.selectAttrs.class"
				:value="props.selectAttrs.value"
				@change="props.selectEvents.change"
			>
				<option v-for="val in props.perPageValues" :value="val" :key="val">{{val}}</option>
			</select>
		</div>
	</div>
</template>

<script>
export default {
	name: "MyPerPageSelector",
	props: ["props"],
}
</script>