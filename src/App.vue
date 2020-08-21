<template>
	<div id="app">
		<TheSidebar />
		<main class="box mb-0" :class="{'sidebar-is-active': sidebarStatus}">
			<base-button class="is-warning is-main sidebar-toggler" @click="toggleSidebar">
				<base-icon>{{togglerIconName}}</base-icon>
			</base-button>
			<keep-alive>
				<router-view />
			</keep-alive>
		</main>
		<TheNotification />
	</div>
</template>

<script>
import TheSidebar from "@/components/TheSidebar"
import TheNotification from '@/components/TheNotification'
import { mapGetters, mapActions } from "vuex"
import '../node_modules/animate.css/animate.css'
import "vue2-datepicker/index.css"
export default {
	components: {
		TheSidebar, TheNotification
	},
	computed: {
		...mapGetters("Sidebar", {
			sidebarStatus: "sidebarStatus",
		}),
		togglerIconName() {
			return (this.sidebarStatus) ? 'first_page' : 'last_page'
		}
	},
	methods: {
		...mapActions("Sidebar", {
			closeSidebar: "close",
			openSidebar: "open"
		}),
		toggleSidebar() {
			if(this.sidebarStatus) return this.closeSidebar()
			return this.openSidebar()
		}
	},
}
</script>

<style lang="scss">
@import "assets/scss/main.scss";
#app {
	font-family: "Noto Sans", sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
main.sidebar-is-active {
	width: calc(100vw - 150px);
	margin-left: 150px;
}
main {
	z-index: 100;
	width: 100vw;
	margin-left: 0;
	position: relative;
	min-height: 100vh;
	transition: .3s ease;
	.sidebar-toggler {
		position: fixed;
		bottom: 30px;
		left: 40px;
		z-index: 2;
	}
}
</style>

