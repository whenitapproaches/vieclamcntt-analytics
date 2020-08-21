var elerem = require("electron").remote
var dialog = elerem.dialog
var app = elerem.app

import XLSX from "xlsx"
import path from "path"
export const exportExcel = async (xlsData) => {
  var toLocalPath = path.resolve(app.getPath("desktop"), "data.xlsx")

  var userChosenPath = await dialog.showSaveDialog({ defaultPath: toLocalPath })

  return new Promise((resolve, reject) => {
    if (userChosenPath.filePath) {
      var wb = XLSX.utils.book_new()
      let sheet = XLSX.utils.json_to_sheet(xlsData)
      XLSX.utils.book_append_sheet(wb, sheet, "Sheet1")
      XLSX.writeFile(wb ,userChosenPath.filePath)
      return resolve()
    }
    return reject()
  })
}
