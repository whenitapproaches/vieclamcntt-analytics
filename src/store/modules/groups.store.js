import { updateGroupSettings, getGroupSettings } from "@/database"

const initialState = function() {
  return {
    groupModerators: [],
    groupDeleteKeywords: [],
  }
}

export default {
  state: initialState(),
  getters: {
    groupModerators: (state) => state.groupModerators,
    groupDeleteKeywords: (state) => state.groupDeleteKeywords,
  },
  actions: {
    fetchGroupSettings: async ({ commit }) => {
      let groupSettings = await getGroupSettings()
      commit("setGroupSettings", groupSettings)
    },
    updateGroupModerators: async ({commit}, array) => {
      console.log(array)
      await updateGroupSettings({
        key: 'moderators',
        array
      })
      commit("setGroupModerators", array)
    },
    updateGroupDeleteKeywords: async ({commit}, array) => {
      console.log(array)
      await updateGroupSettings({
        key: 'deleteKeywords',
        array
      })
      commit("setGroupDeleteKeywords", array)
    }
  },
  mutations: {
    setGroupSettings: (state, groupSettings) => {
      state.groupModerators = groupSettings.moderators
      state.groupDeleteKeywords = groupSettings.deleteKeywords
    },
    setGroupModerators: (state, array) => {
      state.groupModerators = array
    },
    setGroupDeleteKeywords: (state, array) => {
      state.groupDeleteKeywords = array
    }
  },
}
