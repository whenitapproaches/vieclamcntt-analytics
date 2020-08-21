var elerem = require("electron").remote
var dialog = elerem.dialog
var app = elerem.app

const path = require("path")

const jsonfile = require("jsonfile")

const fs = require("fs")

import { getKeywords, setKeywords } from "@/database"

export const saveKeywordsFile = async () => {
  var toLocalPath = path.resolve(app.getPath("desktop"), "keywords.json")

  var userChosenPath = await dialog.showSaveDialog({ defaultPath: toLocalPath })

  var keywords = getKeywords()
  return new Promise((resolve, reject) => {
    if (userChosenPath.filePath) {
      jsonfile.writeFileSync(userChosenPath.filePath, keywords)
      return resolve()
    }

    return reject()
  })
}

export const loadKeywordsFile = async () => {
  var userChosenPath = await dialog.showOpenDialog({
    filters: [{ name: "JSON", extensions: ["json"] }],
  })

  return new Promise((resolve, reject) => {
    if (userChosenPath.filePaths.length > 0) {
      var filepath = userChosenPath.filePaths[0]
      let json = fs.readFileSync(filepath, "utf8")
      let obj = JSON.parse(json)
      setKeywords(obj)
      return resolve()
    }
    return reject()
  })
}
