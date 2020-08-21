import {
  getAccessToken,
  updateAccessToken,
  getGroupId,
  setGroupId,
} from "@/database"

const initialState = function() {
  return {
    accessToken: "",
    groupId: "",
  }
}

export default {
  state: initialState(),
  getters: {
    accessToken: (state) => state.accessToken,
    groupId: (state) => state.groupId
  },
  actions: {
    async updateAccessToken({ commit, dispatch }, access_token) {
      console.log(access_token)
      await updateAccessToken(access_token)
      commit("setAccessToken", access_token)
      dispatch(
        "Notifications/createNotification",
        {
          message: "Cập nhật thành công!",
          status: "success",
        },
        {
          root: true,
        }
      )
    },
    async fetchAccessToken({ commit }) {
      const accessToken = await getAccessToken()
      commit("setAccessToken", accessToken)
    },
    async fetchGroupId({ commit }) {
      const groupId = await getGroupId()
      commit("setGroupId", groupId)
    },
    async updateGroupId({ commit, dispatch }, groupId) {
      await setGroupId(groupId)
      commit("setGroupId", groupId)
      dispatch(
        "Notifications/createNotification",
        {
          message: "Cập nhật thành công!",
          status: "success",
        },
        {
          root: true,
        }
      )
    },
  },
  mutations: {
    setAccessToken: (state, access_token) => {
      state.accessToken = access_token
    },
    setGroupId: (state, groupId) => {
      state.groupId = groupId
    },
  },
}
