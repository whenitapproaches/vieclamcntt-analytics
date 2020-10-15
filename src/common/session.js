var elerem = require("electron").remote
var dialog = elerem.dialog
var app = elerem.app

import path from "path"

import {
  getJobs,
  getLastArticlesUpdated,
  getAccessToken,
  getGroupId,
  getGroupSettings,
  getKeywords,
  setDatabase,
} from "@/database"

const jsonfile = require("jsonfile")

const fs = require("fs")

export const saveSession = async () => {
  var toLocalPath = path.resolve(app.getPath("desktop"), "session.json")

  var userChosenPath = await dialog.showSaveDialog({ defaultPath: toLocalPath })

  var keywords = getKeywords()
  var accessToken = getAccessToken()
  var groupId = getGroupId()
  var jobs = getJobs()
  var lastArticlesUpdated = getLastArticlesUpdated()
  var groupSettings = getGroupSettings()

  var data = {
    keywords,
    groupId,
    jobs,
    accessToken,
    lastArticlesUpdated,
    groupSettings
  }
  return new Promise((resolve, reject) => {
    if (userChosenPath.filePath) {
      jsonfile.writeFileSync(userChosenPath.filePath, data)
      return resolve()
    }
    return reject()
  })
}

export const loadSession = async () => {
  var userChosenPath = await dialog.showOpenDialog({
    filters: [{ name: "JSON", extensions: ["json"] }],
  })

  return new Promise((resolve, reject) => {
    if (userChosenPath.filePaths.length > 0) {
      var filepath = userChosenPath.filePaths[0]
      let json = fs.readFileSync(filepath, "utf8")
      let obj = JSON.parse(json)
      setDatabase(obj)
      return resolve()
    }
    return reject()
  })
}
