<template>
	<article class="message is-danger">
		<div class="message-body">
			<slot></slot>
		</div>
	</article>
</template>

<script>
export default {}
</script>

<style lang="scss">
.message.is-danger {
	background-color: var(--background-red-color);
	.message-body {
		color: var(--red-color);
	}
}
</style>