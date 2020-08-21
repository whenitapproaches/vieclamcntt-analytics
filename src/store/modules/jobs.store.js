import { createJob, getJobs, deleteJob, updateJob } from "@/database"
import { filter, findIndex } from "lodash"

import Vue from "vue"

import { jobValidator } from "@/database/validators"

const initialState = function() {
  return {
    jobs: [],
    isCreatingJob: false,
    isDeletingJob: false,
    isEditingJob: false,
    isDeletingAllJobs: false,
    creatingJobError: {
      message: "",
      path: "",
    },
    editingJobError: {
      message: "",
      path: "",
    },
  }
}

export default {
  state: initialState(),
  getters: {
    jobs: (state) => state.jobs,
    creatingJobStatus: (state) => state.isCreatingJob,
    deletingJobStatus: (state) => state.isDeletingJob,
    editingJobStatus: (state) => state.isEditingJob,
    deletingAllJobsStatus: (state) => state.isDeletingAllJobs,
    creatingJobError: (state) => state.creatingJobError,
    editingJobError: (state) => state.editingJobError,
  },
  actions: {
    openCreatingJob({ commit }) {
      commit("setCreatingJobStatus")
    },
    closeCreatingJob({ commit }) {
      commit("clearCreatingJobStatus")
    },
    openDeletingJob({ commit }) {
      commit("setDeletingJobStatus")
    },
    closeDeletingJob({ commit }) {
      commit("clearDeletingJobStatus")
    },
    openEditingJob({ commit }) {
      commit("setEditingJobStatus")
    },
    closeEditingJob({ commit }) {
      commit("clearEditingJobStatus")
    },
    openDeletingAllJobs({ commit }) {
      commit("setDeletingAllJobsStatus")
    },
    closeDeletingAllJobs({ commit }) {
      commit("clearDeletingAllJobsStatus")
    },
    async createJob(
      { commit, dispatch },
      { company, languages, post_link, posted_date, auto = false, content }
    ) {
      commit("clearCreatingJobError")
      try {
        let validation = await jobValidator.validateAsync({
          company,
          languages,
          post_link,
          posted_date,
          content
        })
        let job = await createJob({ ...validation, auto })
        commit("pushJob", job)
        dispatch("closeCreatingJob")
      } catch (error) {
        console.dir(error)
        if (error.name === "ValidationError") {
          console.log(error.message)
          commit("setCreatingJobError", {
            path: error.details[0].context.label,
            message: error.message,
          })
        }
      }
    },
    async fetchJobs({ commit }) {
      let jobs = await getJobs()
      commit("setJobs", [...jobs])
    },
    async deleteJob({ commit }, { id }) {
      try {
        await deleteJob({
          id: id,
        })
        commit("deleteJob", id)
      } catch (error) {
        console.log(error)
      }
    },
    async deleteAllJobs({ commit }) {
      try {
        await deleteJob()
        commit("setJobs", [])
      } catch (error) {
        console.log(error)
      }
    },
    async editJob(
      { commit, dispatch },
      { id, company, languages, post_link, posted_date, auto = false }
    ) {
      let languagesArray = (!Array.isArray(languages)) ? languages.split(" ") : languages
      commit("clearCreatingJobError")
      try {
        await jobValidator.validateAsync({
          company,
          languages: languagesArray,
          post_link,
          posted_date,
        })
        await updateJob({
          id,
          company,
          languages: languagesArray,
          post_link,
          posted_date,
          auto
        })
        commit("modifyJobs", {
          id,
          company,
          languages: languagesArray,
          post_link,
          posted_date,
          auto
        })
        dispatch("closeEditingJob")
        dispatch(
          "Notifications/createNotification",
          {
            message: "Chỉnh sửa thành công!",
            status: "success",
          },
          {
            root: true,
          }
        )
      } catch (error) {
        console.dir(error)
        if (error.name === "ValidationError") {
          console.log(error.message)
          commit("setEditingJobError", {
            path: error.details[0].path[0],
            message: error.message,
          })
        }
      }
    },
  },
  mutations: {
    setCreatingJobStatus: (state) => {
      state.isCreatingJob = true
    },
    clearCreatingJobStatus: (state) => {
      state.isCreatingJob = false
    },
    setCreatingJobError: (state, { message, path }) => {
      Vue.set(state.creatingJobError, "message", message)
      Vue.set(state.creatingJobError, "path", path)
    },
    clearCreatingJobError: (state) => {
      state.creatingJobError = {
        message: "",
        path: "",
      }
    },
    setEditingJobError: (state, { message, path }) => {
      Vue.set(state.editingJobError, "message", message)
      Vue.set(state.editingJobError, "path", path)
    },
    clearEditingJobError: (state) => {
      state.editingJobError = {
        message: "",
        path: "",
      }
    },
    setDeletingJobStatus: (state) => {
      state.isDeletingJob = true
    },
    clearDeletingJobStatus: (state) => {
      state.isDeletingJob = false
    },
    setDeletingAllJobsStatus: (state) => {
      state.isDeletingAllJobs = true
    },
    clearDeletingAllJobsStatus: (state) => {
      state.isDeletingAllJobs = false
    },
    setEditingJobStatus: (state) => {
      state.isEditingJob = true
    },
    clearEditingJobStatus: (state) => {
      state.isEditingJob = false
    },
    pushJob: (state, job) => {
      state.jobs.push(job)
    },
    setJobs: (state, jobs) => {
      state.jobs = jobs
    },
    deleteJob: (state, id) => {
      state.jobs = filter(state.jobs, function(o) {
        return o.id !== id
      })
    },
    modifyJobs: (
      state,
      { id, company, languages, quantity, post_link, posted_date, auto }
    ) => {
      let index = findIndex(state.jobs, {
        id,
      })
      let data = { company, languages, quantity, post_link, posted_date, auto }
      Object.keys(data).forEach((key) => {
        Vue.set(state.jobs[index], key, data[key])
      })
    },
  },
}
