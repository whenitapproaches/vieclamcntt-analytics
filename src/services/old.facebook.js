import { getAccessToken, getGroupId, getKeywords } from "@/database"
import axios from "axios"
import moment from "moment"
import { find, uniq } from "lodash"
export const fetchArticles = async function(dateRange) {
  const accessToken = await getAccessToken()
  const groupId = await getGroupId()
  const url = `https://graph.facebook.com/v7.0/${groupId}/feed`
  const dateRangeInUnix = dateRange.map((timestamp) => {
    return moment(timestamp).unix()
  })
  return axios.get(url, {
    params: {
      access_token: accessToken,
      since: dateRangeInUnix[0],
      until: dateRangeInUnix[1],
      limit: 500,
      fields: "message,created_time,comments{message}",
    },
  })
}

export const articlesToJob = async function(article) {
  const content = article.content
  if (!content)
    return {
      languages: [],
      company: "Không tìm thấy",
    }
  console.log(content)
  const keywords = { ...getKeywords() }
  let matchedParagraph = languagesExtractorFirstPhase(content, keywords)
  //console.log(matchedParagraph)
  let languages = []
  let company = companyExtractor(content, keywords)
  if (matchedParagraph.length > 0) {
    languages = matchedParagraph.map((paragraph) => {
      return languagesExtractor(paragraph, keywords)
    })
  } else {
    languages = languagesExtractorOnlyLanguages(content, keywords)
  }

  if (!languages) languages = []
  if (!company) company = "Không tìm thấy"
  return {
    languages,
    company,
  }
}

function languagesExtractorOnlyLanguages(content, keywords) {
  const { languages } = keywords
  let joinedLanguages = languages
    .map((language) => [...language.values])
    .reduce((acc, cur) => acc.concat(cur), [])
  let returnLanguages = {}
  let lowerCaseContent = content.toLowerCase()
  let qualifiedLanguages = joinedLanguages.filter((language) => {
    let test = language.length < 3 ? language : language.toLowerCase()
    return (
      lowerCaseContent.includes(" " + test + " ") ||
      lowerCaseContent.includes(" " + test + "\n") ||
      lowerCaseContent.includes("#" + test) ||
      lowerCaseContent.includes(" " + test + ", ") ||
      lowerCaseContent.includes("*" + test + "*") ||
      lowerCaseContent.includes("/" + test + "/") ||
      lowerCaseContent.includes(" " + test + "/")
    )
  })
  qualifiedLanguages = uniq(
    qualifiedLanguages.map((language) => {
      let record = find(languages, function(o) {
        return o.values.includes(language)
      })
      return record.key
    })
  )
  if (qualifiedLanguages.length > 0)
    returnLanguages.languages = qualifiedLanguages
  if (!returnLanguages.languages)
    returnLanguages.languages = ["Không tìm thấy ngôn ngữ"]
  if (!returnLanguages.quantity) returnLanguages.quantity = 1
  return [returnLanguages]
}

function languagesExtractor(content, keywords) {
  const { prefix_quantity, suffix_quantity, languages } = keywords
  let joinedLanguages = languages
    .map((language) => [...language.values])
    .reduce((acc, cur) => acc.concat(cur), [])
  let prefix_quantity_keywords = prefix_quantity
    .sort(function(a, b) {
      return b.length - a.length
    })
    .join("|")
    .replace(/[.*+?^${}()[\]\\]/g, "\\$&")
  let suffix_quantity_keywords = suffix_quantity
    .sort(function(a, b) {
      return b.length - a.length
    })
    .join("|")
    .replace(/[.*+?^${}()[\]\\]/g, "\\$&")
  let languages_keywords = joinedLanguages
    .sort(function(a, b) {
      return b.length - a.length
    })
    .join("|")
    .replace(/[.*+?^${}()[\]\\]/g, "\\$&")
  // let position_keywords = position
  //   .sort(function(a, b) {
  //     return b.length - a.length
  //   })
  //   .join("|")
  //   .replace(/[.*+?^${}()[\]\\]/g, "\\$&")
  let regex = new RegExp(
    `(${prefix_quantity_keywords})+[: .]*([0-9]*)[: ]*([ ]*((${suffix_quantity_keywords})[ ]*)*)*[( ]+((?:(?:${languages_keywords})(?:, | or )*)+)`,
    "gi"
  )
  console.log(regex)
  let lowerCaseContent = content.toLowerCase()
  let exec = lowerCaseContent.matchAll(regex)

  let matches = [...exec]
  let returnLanguages = {}
  var qualifiedQuantity
  var settled = false
  matches.forEach((match) => {
    if (settled) return
    let prefix = match[1]
    var quantity = match[2]
    let suffix = match[3]
    let languages_string = match[6]
    if (!quantity) return
    if (!prefix && !suffix && !languages_string) return
    qualifiedQuantity = +quantity
    settled = true
  })
  //console.log(qualifiedQuantity)
  if (!qualifiedQuantity) {
    let regex = new RegExp(
      `(${prefix_quantity_keywords})+[: .]*([0-9]*)[: ]*([ ]*((${suffix_quantity_keywords})[ ]*)*)*`,
      "gi"
    )
    console.log(regex)
    let exec = lowerCaseContent.matchAll(regex)
    let matches = [...exec]
    matches.forEach((match) => {
      let prefix = match[1]
      var quantity = match[3]
      if (!quantity) return
      //let languages_string = match[6]
      //console.log(prefix)
      if (prefix && quantity && prefix.length > 1) qualifiedQuantity = +quantity
    })
  }
  if (!qualifiedQuantity) {
    let regex = new RegExp(
      `([0-9]*)[: ]*([ ]*((${suffix_quantity_keywords})[ ]*)+)+`,
      "gi"
    )
    console.log(regex)
    let exec = lowerCaseContent.matchAll(regex)
    let matches = [...exec]
    matches.forEach((match) => {
      let suffix = match[2]
      var quantity = match[1]
      if (!quantity) return
      //let languages_string = match[6]
      if (suffix && quantity) qualifiedQuantity = +quantity
    })
  }
  if (!qualifiedQuantity) {
    let regex = new RegExp(`(${languages_keywords}): ([0-9]+)`, "gi")
    console.log(regex)
    let exec = lowerCaseContent.matchAll(regex)
    let matches = [...exec]
    matches.forEach((match) => {
      let suffix = match[1]
      var quantity = match[2]
      if (!quantity) return
      //let languages_string = match[6]
      if (suffix && quantity) qualifiedQuantity = +quantity
    })
  }
  if (!qualifiedQuantity) {
    let regex = new RegExp(`(${prefix_quantity_keywords})+[: .]*([0-9]+) (${languages_keywords})`, "gi")
    console.log(regex)
    let exec = lowerCaseContent.matchAll(regex)
    let matches = [...exec]
    matches.forEach((match) => {
      let suffix = match[1]
      var quantity = match[2]
      if (!quantity) return
      //let languages_string = match[6]
      if (suffix && quantity) qualifiedQuantity = +quantity
    })
  }
  returnLanguages.quantity =
    qualifiedQuantity && qualifiedQuantity < 50 ? qualifiedQuantity : 1
  let qualifiedLanguages = joinedLanguages.filter((language) => {
    let test = language.length < 3 ? language : language.toLowerCase()
    return (
      lowerCaseContent.includes(" " + test + " ") ||
      lowerCaseContent.includes(" " + test + "\n") ||
      lowerCaseContent.includes("#" + test) ||
      lowerCaseContent.includes(" " + test + ", ") ||
      lowerCaseContent.includes("*" + test + "*") ||
      lowerCaseContent.includes("/" + test + "/") ||
      lowerCaseContent.includes(" " + test + "/")
    )
  })
  qualifiedLanguages = uniq(
    qualifiedLanguages.map((language) => {
      let record = find(languages, function(o) {
        return o.values.includes(language)
      })
      return record.key
    })
  )
  if (qualifiedLanguages.length > 0)
    returnLanguages.languages = qualifiedLanguages
  if (!returnLanguages.languages)
    returnLanguages.languages = ["Không tìm thấy ngôn ngữ"]
  if (!returnLanguages.languages)
    returnLanguages.languages = ["Không tìm thấy ngôn ngữ"]
  if (!returnLanguages.quantity) returnLanguages.quantity = 1
  return returnLanguages
}

function companyExtractor(content, keywords) {
  const { company } = keywords
  let joinedCompany = company
    .map((com) => [...com.values])
    .reduce((acc, cur) => acc.concat(cur), [])
  if (!content) return ""
  const lowerCaseContent = content.toLowerCase()
  const companyExtracted = joinedCompany.filter((item) =>
    lowerCaseContent.includes(item.toLowerCase())
  )
  let chosenCompany
  if (companyExtracted) chosenCompany = companyExtracted[0]
  if (!chosenCompany) return ""
  let record = find(company, function(o) {
    return o.values.includes(chosenCompany)
  })
  return record.key
}

function languagesExtractorFirstPhase(content, keywords) {
  const { prefix_quantity, suffix_quantity, languages } = keywords
  let joinedLanguages = languages
    .map((language) => [...language.values])
    .reduce((acc, cur) => acc.concat(cur), [])
  //console.log(joinedLanguages)
  let prefix_quantity_keywords = prefix_quantity
    .sort(function(a, b) {
      return b.length - a.length
    })
    .join("|")
    .replace(/[.*+?^${}()[\]\\]/g, "\\$&")
  let suffix_quantity_keywords = suffix_quantity
    .sort(function(a, b) {
      return b.length - a.length
    })
    .join("|")
    .replace(/[.*+?^${}()[\]\\]/g, "\\$&")
  let languages_keywords = joinedLanguages
    .sort(function(a, b) {
      return b.length - a.length
    })
    .join("|")
    .replace(/[.*+?^${}()[\]\\]/g, "\\$&")
  // let position_keywords = position
  //   .sort(function(a, b) {
  //     return b.length - a.length
  //   })
  //   .join("|")
  //   .replace(/[.*+?^${}()[\]\\]/g, "\\$&")
  let regexToLines = new RegExp(/[^\r\n]+/, "g")
  let regexMatchPhrase1 = new RegExp(
    `(${prefix_quantity_keywords})+[: .]*([0-9]+)`,
    "i"
  )
  let regexMatchPhrase2 = new RegExp(
    `([0-9]+)[: .]*([ ]*(${suffix_quantity_keywords})[ ]*)+`,
    "i"
  )
  let regexMatchPhrase3 = new RegExp(
    `([0-9]+)[: .]*([ ]*(?:(?:${languages_keywords})(?:, | or )*)+) `,
    "i"
  )
  let regexMatchPhrase4 = new RegExp(
    `(${suffix_quantity_keywords}|${prefix_quantity_keywords})[: .]*([ ]*(?:(?:${languages_keywords}))+) `,
    "i"
  )
  let regexMatchPhrase5 = new RegExp(
    `[\n ][: .]*([ ]*(?:(?:${languages_keywords})(?:, | or )*)+) (${suffix_quantity_keywords})`,
    "i"
  )
  let regexMatchPhrase6 = new RegExp(
    `(${languages_keywords}): ([0-9]+)`,
    "i"
  )
  console.log(regexMatchPhrase1)
  console.log(regexMatchPhrase2)
  console.log(regexMatchPhrase3)
  console.log(regexMatchPhrase4)
  let lowerCaseContent = content.toLowerCase()
  let shouldContainQuantity = regexMatchPhrase1.test(lowerCaseContent)
  let arrayOfLines = lowerCaseContent.match(regexToLines)
  var matchedParagraph = []
  let isChosen = false
  var paragraph = ""
  arrayOfLines.forEach((line, index) => {
    let test
    //console.log(line)
    test = regexMatchPhrase1.test(line)

    if (!test) {
      test = regexMatchPhrase2.test(line)
    }
    if (!test) {
      test = regexMatchPhrase3.test(line)
    }
    if (!test) {
      test = regexMatchPhrase4.test(line)
      //console.log(test)
    }
    if (!test && !shouldContainQuantity) {
      test = regexMatchPhrase5.test(line)
    }
    if (!test) {
      test = regexMatchPhrase6.test(line)
    }
    if (test) //console.log("true ne")
    if (test && isChosen) {
      //console.log("them vao")
      matchedParagraph.push(paragraph)
      paragraph = ""
      isChosen = false
    }
    if (test && !isChosen) isChosen = true

    if (isChosen) {
      paragraph += `${line}\n`
    }
    if (index === arrayOfLines.length - 1) {
      matchedParagraph.push(paragraph)
      paragraph = ""
      isChosen = false
    }
  })
  if (matchedParagraph.length === 1 && matchedParagraph[0] === "") return []
  return matchedParagraph
}
