import { nanoid } from "nanoid"

export const makeGetJobs = function({ db }) {
  return function getJobs() {
    return db.get("jobs").write()
  }
}

export const makeCreateJob = function({ db }) {
  return async function createJob({
    company,
    languages,
    posted_date = Date.now(),
    post_link = "",
    content = "",
    auto,
  }) {
    let data = {
      id: nanoid(),
      company,
      languages,
      posted_date,
      post_link,
      content,
      auto,
    }
    db.get("jobs")
      .push({
        ...data,
      })
      .write()
    return data
  }
}

export const makeUpdateJob = function({ db }) {
  return async function updateJob({
    id,
    company,
    languages,
    posted_date = Date.now(),
    post_link = "",
    auto,
  }) {
    db.get("jobs")
      .find({ id })
      .update({
        company: company,
        languages: languages,
        posted_date: posted_date,
        post_link: post_link,
        auto,
      })
      .write()
    return id
  }
}

export const makeGetFacebookSettings = function({ db }) {
  return function getFacebookSettings() {
    return db.getState().settings.facebook
  }
}

export const makeDeleteJob = function({ db }) {
  return function deleteJob(params) {
    return db
      .get("jobs")
      .remove(params)
      .write()
  }
}

export const makeGetArticles = function({ db }) {
  return function getArticles() {
    return db.get("articles").write()
  }
}

export const makeGetLastArticlesUpdated = function({ db }) {
  return function getLastArticlesUpdated() {
    return db.get("lastArticlesUpdated").write()
  }
}

export const makeUpdateLastArticlesUpdated = function({ db }) {
  return function updateLastArticlesUpdated(timestamp) {
    return db.set("lastArticlesUpdated", timestamp).write()
  }
}

export const makUpdateAccessToken = function({ db }) {
  return function updateAccessToken(access_token) {
    return db.set("accessToken", access_token).write()
  }
}
export const makeGetAccessToken = function({ db }) {
  return function getAccessToken() {
    return db.get("accessToken").write()
  }
}

export const makeGetGroupId = function({ db }) {
  return function getGroupId() {
    return db.get("groupId").write()
  }
}

export const makeSetGroupId = function({ db }) {
  return function setGroupId(groupId) {
    return db.set("groupId", groupId).write()
  }
}

export const makeUpdateKeywords = function({ db }) {
  return function updateKeywords({ key, array }) {
    return db
      .get("keywords")
      .set(key, array)
      .write()
  }
}
export const makeGetKeywords = function({ db }) {
  return function getKeywords() {
    return db.get("keywords").write()
  }
}

export const makeSetKeywords = function({ db }) {
  return function setKeywords(keywords) {
    return db.set("keywords", keywords).write()
  }
}

export const makeSetDatabase = function({ db }) {
  return function setDatabase(obj) {
    return db.setState(obj).write()
  }
}

export const makeUpdateGroupSettings = function({ db }) {
  return function updateGroupSettings({ key, array }) {
    return db
      .get("groupSettings")
      .set(key, array)
      .write()
  }
}

export const makeGetGroupSettings = function({db}) {
  return function getGroupSettings() {
    return db.get("groupSettings").write()
  }
}