
const initialState = function() {
  return {
    notification: {
      message: "",
      status: "",
      shown: false
    },

  }
}

export default {
  state: initialState(),
  getters: {
    notification: (state) => state.notification,
  },
  actions: {
    createNotification: ({ commit }, { message, status }) => {
      commit("clearNotification")
      commit("setNotification", {
        message,
        status,
      })
    },
    deleteNotification: ({ commit }) => {
      commit("clearNotification")
    },
  },
  mutations: {
    setNotification: (state, { message, status }) => {
      state.notification = {
        message: message,
        status: status,
        shown: true
      }
    },
    clearNotification: (state) => {
      if(state.notification.status === 'loading') return
      state.notification.shown = false
    },
  },
}
