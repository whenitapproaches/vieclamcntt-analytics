<template>
	<button class="button is-rounded" @click="$emit('click')">
		<slot></slot>
	</button>
</template>

<script>
export default {
	methods: {},
}
</script>

<style lang="scss">
button.button {
	&.is-squared {
		width: 40px;
		padding-left: 0 !important;
		padding-right: 0 !important;
	}
	height: 40px;
	font-size: 1rem;
	$string: "yellow-color";
	&.is-warning {
		color: var(--#{$string});
		background-color: var(--background-#{$string});
		&:focus {
			color: var(--#{$string});
		}
		&.is-main {
			color: var(--white-color);
			background-color: var(--#{$string});
			&:focus {
				color: var(--white-color);
			}
		}
	}
	$string: "green-color";
	&.is-success {
		color: var(--#{$string});
		background-color: var(--background-#{$string});
		&:focus {
			color: var(--#{$string});
		}
	}
	$string: "blue-color";
	&.is-info {
		color: var(--#{$string});
		background-color: var(--background-#{$string});
		&:focus {
			color: var(--#{$string});
		}
	}
	$string: "red-color";
	&.is-danger {
		color: var(--#{$string});
		background-color: var(--background-#{$string});
		&:focus {
			color: var(--#{$string});
		}
	}
	&:hover {
		color: var(--white-color) !important;
	}
	transition: 0.3s ease;
	letter-spacing: 2px;
	&.is-rounded {
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}
	&:focus,
	&:active {
		border: none !important;
		outline: none;
		box-shadow: none !important;
	}
}
</style>