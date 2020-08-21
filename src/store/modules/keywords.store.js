import { getKeywords, updateKeywords } from "@/database"
import { findIndex } from "lodash"
const initialState = function() {
  return {
    company: [],
    languages: [],
    prefix_quantity: [],
    suffix_quantity: [],
    position: [],
    conjunctions: [],
    isEditing: false,
    isCreating: false,
    currentEditingField: "",
    currentCreatingField: "",
  }
}

export default {
  state: initialState(),
  getters: {
    keywords: (state) => ({
      company: state.company,
      languages: state.languages,
      prefix_quantity: state.prefix_quantity,
      suffix_quantity: state.suffix_quantity,
      position: state.position,
      conjunctions: state.conjunctions
    }),
    editingKeywordsStatus: (state) => state.isEditing,
    creatingKeywordsStatus: (state) => state.isCreating,
    currentEditingField: (state) => state.currentEditingField,
  },
  actions: {
    fetchKeywords: async ({ commit }) => {
      let keywords = await getKeywords()
      commit("setKeywords", keywords)
    },
    updateKeywords: async ({ commit }, { key, array }) => {
      await updateKeywords({ key, array })
      commit("setKeywords", {
        [key]: [...array],
      })
    },
    closeEditingKeywords: ({ commit }) => {
      commit("clearEditingKeywordsStatus")
    },
    openEditingKeywords: ({ commit }, { field }) => {
      commit("setEditingKeywordsStatus")
      commit("setCurrentEditingField", field)
    },
    closeCreatingKeywords: ({ commit }) => {
      commit("clearCreatingKeywordsStatus")
    },
    openCreatingKeywords: ({ commit }, { field }) => {
      commit("setCreatingKeywordsStatus")
      commit("setCurrentCreatingField", field)
    },
    deleteKeyword: async ({ commit, state, dispatch }, { field, index }) => {
      let fieldKeywords = [...state[field]]
      fieldKeywords.splice(index, 1)
      commit("setKeywords", {
        [field]: fieldKeywords,
      })
      await dispatch("updateKeywords", {
        key: [field],
        array: fieldKeywords,
      })
    },
    editKeyword: async ({ commit, dispatch, state }, { field, values }) => {
      let arr = [...state[state.currentEditingField]]
      let index = findIndex(arr, {
        key: field,
      })
      arr[index].values = values
      commit("setKeywords", {
        [state.currentEditingField]: arr,
      })
      await dispatch("updateKeywords", {
        key: state.currentEditingField,
        array: arr,
      })
    },
    createKeyword: async ({ commit, dispatch, state }, { field, values }) => {
      let arr = [...state[state.currentCreatingField]]
      arr.push({
        key: field,
        values: values,
      })
      commit("setKeywords", {
        [state.currentCreatingField]: arr,
      })
      await dispatch("updateKeywords", {
        key: state.currentEditingField,
        array: arr,
      })
    },
  },
  mutations: {
    setKeywords: (state, keywords) => {
      Object.keys(keywords).forEach((keyword) => {
        state[keyword] = keywords[keyword]
      })
    },
    clearEditingKeywordsStatus: (state) => {
      state.isEditing = false
    },
    setEditingKeywordsStatus: (state) => {
      state.isEditing = true
    },
    clearCreatingKeywordsStatus: (state) => {
      state.isCreating = false
    },
    setCreatingKeywordsStatus: (state) => {
      state.isCreating = true
    },
    setCurrentEditingField: (state, field) => {
      state.currentEditingField = field
    },
    setCurrentCreatingField: (state, field) => {
      state.currentCreatingField = field
    },
  },
}
