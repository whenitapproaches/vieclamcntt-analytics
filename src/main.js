import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import CustomVTables from "@/components/CustomVTables/CustomVTables"
import TablePagination from "@/components/CustomVTables/TablePagination"
import TableSortControl from "@/components/CustomVTables/TableSortControl"
import TableRow from "@/components/CustomVTables/TableRow"
import TableBody from "@/components/CustomVTables/TableBody"
import TableSearchInput from '@/components/CustomVTables/TableSearchInput'
import TableChildRow from "@/components/CustomVTables/TableChildRow"
import TableChildRowToggler from "@/components/CustomVTables/TableChildRowToggler"
import PerPageSelector from "@/components/CustomVTables/PerPageSelector"
import VueTooltip from 'v-tooltip'
Vue.config.productionTip = false

import Suggest from 'v-suggest'
Vue.use(Suggest)

import { upperFirst, camelCase } from "lodash"

import { ClientTable } from "vue-tables-2"

Vue.use(ClientTable, {}, false, "bulma", {
  dataTable: CustomVTables,
  pagination: TablePagination,
  sortControl: TableSortControl,
  tableRow: TableRow,
  childRow: TableChildRow,
  childRowToggler: TableChildRowToggler,
  tableBody: TableBody,
  genericFilter: TableSearchInput,
  perPageSelector: PerPageSelector
})

Vue.use(VueTooltip, {
  defaultOffset: 10,
})

// Automatically Register Base Components to Global
const requireComponent = require.context(
  "@/components",
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach((fileName) => {
  // Load component config
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(
      // Strip the leading `./` and extension from the filename
      fileName.replace(/^\.\/(.*)\.\w+$/, "$1")
    )
  )
  Vue.component(componentName, componentConfig.default || componentConfig)
})
//

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app")
