<template>
	<transition :enter-active-class="computedEnterClass" :leave-active-class="computedLeaveClass">
		<slot></slot>
	</transition>
</template>

<script>
export default {
	props: {
		enterClass: {
			type: String,
			default: "fadeIn",
		},
		leaveClass: {
			type: String,
			default: "fadeOut",
		},
		library: {
			type: String,
			default: "animate.css",
		},
		extraClass: {
			type: String,
			default: "",
		},
	},
	computed: {
		computedEnterClass() {
			if (this.library === "animate.css") {
				return (
					"animate__animated " +
					`animate__${this.enterClass} ` +
					this.extraClass
				)
			}
			return this.enterClass + this.extraClass
		},
		computedLeaveClass() {
			if (this.library === "animate.css") {
				return (
					"animate__animated " +
					`animate__${this.leaveClass} ` +
					this.extraClass
				)
			}
			return this.leaveClass + this.extraClass
		},
	},
}
</script>

<style>
</style>