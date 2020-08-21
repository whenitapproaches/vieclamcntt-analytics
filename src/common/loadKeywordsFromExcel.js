import { updateKeywords } from "@/database"

var elerem = require("electron").remote
var dialog = elerem.dialog

const XLSX = require("xlsx")

export const loadKeywordsFromExcel = async function(field) {
  var userChosenPath = await dialog.showOpenDialog({
    filters: [{ name: "Excel", extensions: ["xlsx"] }],
  })

  return new Promise((resolve, reject) => {
    if (userChosenPath.filePaths.length > 0) {
      var filepath = userChosenPath.filePaths[0]
      let xlsx = XLSX.readFile(filepath)
      let sheets = xlsx.Sheets
      let firstSheet = sheets[Object.keys(xlsx.Sheets)[0]]
      let json = XLSX.utils.sheet_to_json(firstSheet)
      let clonedJson = [...json]
      let collection
      if (field === "company" || field === "languages") {
        collection = clonedJson.map((row) => {
          let key = row["Khóa chính"]
          if (!key) return
          let values = row["Các từ khóa"]
          if (!values) return
          let arrayValues = values.split(", ")
          return {
            key,
            values: arrayValues,
          }
        })
      } else {
        collection = clonedJson.map((row) => row["Từ khóa"])
      }
      let result = collection.filter((record) => record)
      console.log(result)
      if (result.length === 0) return reject("no_field_found")
      updateKeywords({ key: field, array: result })
      resolve()
    }
    reject()
  })
}