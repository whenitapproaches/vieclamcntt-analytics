const initialState = function() {
  return {
    isSidebarToggled: true,
  }
}

export default {
  state: initialState(),
  getters: {
    sidebarStatus: (state) => state.isSidebarToggled,
  },
  actions: {
    open: ({ commit }) => {
      commit("setSidebarStatus")
    },
    close: ({ commit }) => {
      commit("clearSidebarStatus")
    },
  },
  mutations: {
    setSidebarStatus(state) {
      state.isSidebarToggled = true
    },
    clearSidebarStatus(state) {
      state.isSidebarToggled = false
    },
  },
}
