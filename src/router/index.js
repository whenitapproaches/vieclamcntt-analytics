import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/articles",
    name: "Articles",
    component: () => import("@/views/Articles"),
  },
  {
    path: "/statistics",
    name: "Statistics",
    component: () => import("@/views/Statistics"),
  },
  {
    path: "/keywords",
    name: "Keywords",
    component: () => import("@/views/Keywords"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("@/views/Settings"),
  },
  {
    path: "/guide",
    name: "Guide",
    component: () => import("@/views/Guide"),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
