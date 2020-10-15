const trainDataPath = "src/services/lines-classification/Train_Data.py"

import { PythonShell } from "python-shell"

import { getKeywords } from '@/database'

export default async function trainData() {
  const languages = getJoinedLanguages()
  const languagesArgv = languages.length > 0 ? languages.join("\n") : " "
  let pyshell = new PythonShell(trainDataPath, {
    mode: 'text',
    args: [languagesArgv]
  })
  pyshell.on("message", (data) => {
    console.log("Python: ", data)
  })
}


function getJoinedLanguages() {
  const { languages } = getKeywords()
  let joinedLanguages = languages
    .map((language) => [...language.values])
    .reduce((acc, cur) => acc.concat(cur), [])
    .sort((a, b) => b.length - a.length)
  return joinedLanguages
}
