<template>
	<aside :class="{'is-active': sidebarStatus}">
		<ul class="sidebar-menu">
			<li class="sidebar-menu__item">
				<router-link
					:to="{name: 'Statistics'}"
					class="sidebar-menu__item--link mb-3"
					activeClass="is-active"
				>
					<base-icon class="icon md-48">analytics</base-icon>
				</router-link>
				<p>Thống kê</p>
			</li>
			<li class="sidebar-menu__item">
				<router-link
					:to="{name: 'Articles'}"
					class="sidebar-menu__item--link mb-3"
					activeClass="is-active"
				>
					<base-icon class="icon md-48">library_books</base-icon>
				</router-link>
				<p>Bài đăng</p>
			</li>
			<li class="sidebar-menu__item">
				<router-link
					:to="{name: 'Keywords'}"
					class="sidebar-menu__item--link mb-3"
					activeClass="is-active"
				>
					<base-icon class="icon md-48">font_download</base-icon>
				</router-link>
				<p>Từ khóa</p>
			</li>
			<li class="sidebar-menu__item">
				<router-link
					:to="{name: 'Settings'}"
					class="sidebar-menu__item--link mb-3"
					activeClass="is-active"
				>
					<base-icon class="icon md-48">settings</base-icon>
				</router-link>
				<p>Cài đặt</p>
			</li>
			<li class="sidebar-menu__item">
				<router-link
					:to="{name: 'Guide'}"
					class="sidebar-menu__item--link mb-3"
					activeClass="is-active"
				>
					<base-icon class="icon md-48">help</base-icon>
				</router-link>
				<p>Hướng dẫn</p>
			</li>
		</ul>
	</aside>
</template>

<script>
import { mapGetters } from "vuex"
export default {
	name: "TheSidebar",
	data() {
		return {}
	},
	computed: {
		...mapGetters("Sidebar", {
			sidebarStatus: "sidebarStatus",
		}),
	},
}
</script>

<style scoped lang="scss">
aside {
	$width: 150px;
	width: $width;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	margin-left: -$width;
	background-color: var(--gray-color);
	transition: 0.3s ease;
	&.is-active {
		margin-left: 0;
	}
}
.sidebar-menu {
	padding: 20px 0px;
	&__item {
		padding: 20px 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		&--link {
			color: var(--text-secondary-color);
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: 900;
			text-transform: uppercase;
			letter-spacing: 1px;
			transition: 0.3s ease;
			width: 60px;
			height: 60px;
			border-radius: 50%;
			.icon {
				display: flex;
			}
			&.is-active,
			&:hover {
				background-color: var(--background-blue-color);
				color: var(--blue-color);
			}
		}
		p {
			color: var(--text-secondary-color);
			font-weight: bold;
			text-transform: uppercase;
		}
	}
}
</style>