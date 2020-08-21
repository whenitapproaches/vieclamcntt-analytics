<template>
	<base-transition enterClass="bounceIn" leaveClass="bounceOut">
		<div
			class="notification columns is-vcentered"
			:class="getNotificationClass(notification.status)"
			v-show="notification.shown"
		>
			<base-icon class="loading mr-2" v-if="notification.status === 'loading'">loop</base-icon>
			<base-icon class="success mr-2" v-if="notification.status === 'success'">done</base-icon>
			{{notification.message}}
		</div>
	</base-transition>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { debounce } from "lodash"
export default {
	computed: {
		...mapGetters("Notifications", {
			notification: "notification",
		}),
	},
	methods: {
		getNotificationClass(status) {
			if (status === "error") {
				return "is-danger"
			}
			return "is-success"
		},
		...mapActions("Notifications", {
			deleteNotification: "deleteNotification",
		}),
	},
	updated() {
		if (this.notification.status !== "loading") {
			this.debounceNotification()
		}
	},
	mounted() {
		this.debounceNotification = debounce(this.deleteNotification, 7000)
	},
}
</script>

<style scoped lang="scss">
.notification {
	position: fixed !important;
	z-index: 100;
	bottom: 60px;
	right: 60px;
	width: 300px;
	$string: "yellow-color";
	&.is-warning {
		color: var(--white-color);
		background-color: var(--#{$string});
	}
	$string: "green-color";
	&.is-success {
		color: var(--white-color);
		background-color: var(--#{$string});
	}
	$string: "blue-color";
	&.is-info {
		color: var(--#{$string});
		background-color: var(--background-#{$string});
	}
	$string: "red-color";
	&.is-danger {
		color: var(--white-color);
		background-color: var(--#{$string});
	}
	.loading {
		animation: spinning 2s infinite linear;
	}
}
@keyframes spinning {
	0% {
		transform: rotate(360deg);
	}
	100% {
		transform: rotate(0deg);
	}
}
</style>