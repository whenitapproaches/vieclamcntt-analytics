import {
  getArticles,
  getLastArticlesUpdated,
  updateLastArticlesUpdated,
} from "@/database"
import moment from "moment"
import { fetchArticles } from "@/services/facebook"
import { articlesToJob } from "@/services/facebook.worker"

// import articleSamples from "./articles.example"

// import { exportExcel } from "@/common/exportExcel"
import { chunk } from "lodash"

const initialState = function() {
  return {
    articles: [],
    lastArticlesUpdated: null,
    fetchingArticlesDateRange: [],
  }
}

export default {
  state: initialState(),
  getters: {
    articles: (state) => state.articles,
    lastArticlesUpdated: (state) => state.lastArticlesUpdated,
    fetchingArticlesDateRange: (state) => state.fetchingArticlesDateRange,
  },
  actions: {
    async fetchArticles({ commit }) {
      let articles = await getArticles()
      commit("setArticles", articles)
    },
    async scanArticle({ dispatch }, article) {
      let job = await articlesToJob(article)
      await dispatch(
        "Jobs/createJob",
        {
          company: job.company,
          languages: job.languages,
          post_link: article.post_link,
          posted_date: moment(article.posted_date).valueOf(),
          content: article.content,
          auto: true,
        },
        {
          root: true,
        }
      )
      dispatch(
        "Notifications/createNotification",
        {
          message: "Phân tích thành công!",
          error: "success",
        },
        {
          root: true,
        }
      )
    },
    async scanArticles({ state, dispatch }) {
      let articles = state.articles
      const processes = 3
      let chunkedArticles = chunk(articles, processes)
      console.log(chunkedArticles)
      await chunkedArticles.reduce((acc, chunk) => {
        return acc.then(async () => {
          await chunk.forEach(async (article) => {
            let job = await articlesToJob(article)
            await dispatch(
              "Jobs/createJob",
              {
                company: job.company,
                languages: job.languages,
                post_link: article.post_link,
                posted_date: moment(article.posted_date).valueOf(),
                content: article.content,
                auto: true,
              },
              {
                root: true,
              }
            )
            return
          })
        })
      }, Promise.resolve())
      dispatch(
        "Notifications/createNotification",
        {
          message: "Phân tích thành công",
          status: "success",
        },
        {
          root: true,
        }
      )
    },
    async fetchArticlesFromFacebook({ commit, dispatch }, dateRange = []) {
      if (!dateRange[0] || !dateRange[1]) {
        return dispatch(
          "Notifications/createNotification",
          {
            message: "Vui lòng chọn khoảng thời gian để lấy bài đăng.",
            status: "error",
          },
          {
            root: true,
          }
        )
      }
      dateRange[1] = moment(dateRange[1]).add("24", "hour")
      try {
        let response = await fetchArticles(dateRange)
        console.log(response)
        let data = response.data.data
        dispatch("updateLastArticlesUpdated", Date.now())
        if (data.length === 0) {
          commit("setArticles", [])
          return dispatch(
            "Notifications/createNotification",
            {
              message: "Không tìm thấy bài đăng nào.",
              status: "error",
            },
            {
              root: true,
            }
          )
        }
        let articles = await dataToArticles(data, dateRange)
        commit("setArticles", articles)
        // exportExcel(articles)
        return dispatch(
          "Notifications/createNotification",
          {
            message: "Quét thành công.",
            status: "success",
          },
          {
            root: true,
          }
        )
      } catch (error) {
        console.dir(error)
        if (error.response.status === 403) {
          return dispatch(
            "Notifications/createNotification",
            {
              message:
                "Vượt giới hạn Facebook cho phép, vui lòng lấy token từ một app khác.",
              status: "error",
            },
            {
              root: true,
            }
          )
        }
        return dispatch(
          "Notifications/createNotification",
          {
            message:
              "Có lỗi xảy ra. Chắc chắn bạn nhập đúng id group và access token.",
            status: "error",
          },
          {
            root: true,
          }
        )
      }
    },
    async fetchLastArticlesUpdated({ commit }) {
      let timestamp = await getLastArticlesUpdated()
      commit("setLastArticlesUpdated", timestamp)
    },
    async updateLastArticlesUpdated({ commit }, timestamp) {
      await updateLastArticlesUpdated(timestamp)
      commit("setLastArticlesUpdated", timestamp)
    },
  },
  mutations: {
    setArticles: (state, articles) => {
      state.articles = articles
      console.log(articles)
    },
    setLastArticlesUpdated(state, timestamp) {
      state.lastArticlesUpdated = timestamp
    },
    setFetchingArticlesDateRange(state, range) {
      state.fetchingArticlesDateRange = range
    },
  },
}

import { uniqBy } from "lodash"
import { getGroupSettings } from "@/database"
const keycapDigits = [
  "0️⃣",
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
]
async function dataToArticles(data, dateRange) {
  data = data.map((post) => {
    if (!post.attachments) return post

    let message

    let postMessage = post.message ? post.message : ""

    let description = post.attachments.data[0].description

    message =
      postMessage.length < description.length ? description : postMessage

    return {
      ...post,
      message,
    }
  })
  let dataFilteredByDate = data.filter((post) => {
    let created_time_value = moment(post.created_time).valueOf()
    return (
      dateRange[0] < created_time_value &&
      created_time_value < dateRange[1] &&
      post.message
    )
  })
  let groupSettings = await getGroupSettings()
  let { deleteKeywords } = groupSettings
  let dataFilteredByComments = dataFilteredByDate.filter((post) => {
    if (!deleteKeywords) return post
    if (!post.comments) return true
    let comments = post.comments.data
    let found = false
    comments.forEach((comment) => {
      if (!comment) return
      if (found) return
      if (deleteKeywords.includes(comment.message)) found = true
    })
    if (found) return false
    return true
  })
  let dataUnique = uniqBy(dataFilteredByComments, "message")
  return dataUnique.map((post) => {
    let splitted = post.id.split("_")
    let group_id = splitted[0]
    let link_id = splitted[1]
    let post_link = `https://www.facebook.com/groups/${group_id}/permalink/${link_id}/`
    let filteredContent = post.message
      .replace(/\*/g, "")
      .replace(/##/g, "")
      .replace(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/g,
        ""
      )
    keycapDigits.forEach((digit, index) => {
      let regexp = new RegExp(`${digit}`, "g")
      filteredContent = filteredContent.replace(regexp, index)
    })
    return {
      content: filteredContent,

      posted_date: post.created_time,
      post_link: post_link,
    }
  })
}
