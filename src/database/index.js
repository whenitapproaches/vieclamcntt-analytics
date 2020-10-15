import low from "lowdb"

import FileSync from "lowdb/adapters/FileSync"

const adapter = new FileSync("database.json")

const db = low(adapter)

db.defaults({
  jobs: [],
  articles: [],
  accessToken: "",
  lastArticlesUpdated: null,
  groupId: "",
  keywords: {
    company: [],
    languages: [],
    prefix_quantity: [],
    suffix_quantity: [],
    position: [],
    conjunctions: []
  },
  groupSettings: {
    deleteKeywords: []
  }
}).write()

import {
  makeGetJobs,
  makeCreateJob,
  makeGetFacebookSettings,
  makeDeleteJob,
  makeUpdateJob,
  makeGetArticles,
  makeGetLastArticlesUpdated,
  makeUpdateLastArticlesUpdated,
  makUpdateAccessToken,
  makeGetAccessToken,
  makeGetGroupId,
  makeSetGroupId,
  makeUpdateKeywords,
  makeGetKeywords,
  makeSetKeywords,
  makeSetDatabase,
  makeGetGroupSettings,
  makeUpdateGroupSettings
} from "./methods"

const getJobs = makeGetJobs({ db })
const createJob = makeCreateJob({ db })
const getFacebookSettings = makeGetFacebookSettings({ db })
const deleteJob = makeDeleteJob({ db })
const updateJob = makeUpdateJob({ db })
const getArticles = makeGetArticles({ db })
const getLastArticlesUpdated = makeGetLastArticlesUpdated({ db })
const updateLastArticlesUpdated = makeUpdateLastArticlesUpdated({ db })
const updateAccessToken = makUpdateAccessToken({ db })
const getAccessToken = makeGetAccessToken({ db })
const getGroupId = makeGetGroupId({ db })
const setGroupId = makeSetGroupId({ db })
const updateKeywords = makeUpdateKeywords({ db })
const getKeywords = makeGetKeywords({ db })
const setKeywords = makeSetKeywords({ db })
const setDatabase = makeSetDatabase({ db })
const getGroupSettings = makeGetGroupSettings({db})
const updateGroupSettings = makeUpdateGroupSettings({db})
export {
  getJobs,
  createJob,
  getFacebookSettings,
  deleteJob,
  updateJob,
  getArticles,
  getLastArticlesUpdated,
  updateLastArticlesUpdated,
  updateAccessToken,
  getAccessToken,
  getGroupId,
  setGroupId,
  updateKeywords,
  getKeywords,
  setKeywords,
  setDatabase,
  getGroupSettings,
  updateGroupSettings
}
