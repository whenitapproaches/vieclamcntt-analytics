import { find, uniq, groupBy } from "lodash"
import { getKeywords } from "@/database"

const DEVELOPMENT = false

// const linesClassificationPath =
//   "src/services/lines-classification/Text_Classification.py"

// import { PythonShell } from "python-shell"

// function classifyLines(content) {
//   const joinedLanguages = getJoinedLanguages()
//   const languages = joinedLanguages.length ? joinedLanguages.join("\n") : " "
//   return new Promise((resolve, reject) => {
//     let pyshell = new PythonShell(linesClassificationPath, {
//       mode: "text",
//       args: [content, languages],
//     })
//     pyshell.on("message", (data) => {
//       resolve(data.split(" "))
//     })
//     pyshell.on("error", (error) => {
//       console.log(error)
//       reject()
//     })
//   })
// }

export const articlesToJob = async function(article) {
  let content = article.content
  if (!content)
    return {
      languages: [],
      company: "Không tìm thấy",
    }
  let returnLanguages = []
  let returnCompany

  // let acceptedLines = await classifyLines(content)

  // let lines = contentToLines(content)

  // acceptedLines.forEach(line => {
  //   console.log(line, " > ", lines[line])
  // })
  const keywords = { ...getKeywords() }

  returnCompany = companyExtractor(content, keywords)

  let isTypeOfList = checkTypeOfList(content)

  if (!isTypeOfList) {
    let hiringParagraphs = contentToParagraph(content)

    if (hiringParagraphs.length !== 0) {
      hiringParagraphs.forEach((paragraph) => {
        let result = searchForHiringPhrase(paragraph)
        console.log(result)
        if (Array.isArray(result)) {
          result.forEach((r) => returnLanguages.push(r))
        } else {
          returnLanguages.push(result)
        }
      })
    } else {
      let result = searchForHiringPhraseSpecialCase(content)
      returnLanguages.push(result)
    }
  } else {
    isTypeOfList.forEach((r) => returnLanguages.push(r))
  }

  if (!returnCompany) returnCompany = "Không tìm thấy"

  if (returnLanguages.length === 0 || returnLanguages[0] === undefined) {
    return {
      languages: [
        {
          quantity: 1,
          languages: ["Không tìm thấy nhu cầu"],
        },
      ],
      company: returnCompany,
    }
  } else {
    returnLanguages.map((language) => {
      if (
        language.languages.length === 0 ||
        language.languages[0] === undefined
      )
        language.languages[0] = "Không tìm thấy nhu cầu"
      if (language.quantity === 0 || language.quantity === undefined)
        language.quantity = 1
      return language
    })
  }

  return {
    languages: returnLanguages,
    company: returnCompany,
  }
}

function contentToParagraph(content) {
  let prefixQuantityKeywords = getPrefixQuantityKeywords()
  let suffixQuantityKeywords = getSuffixQuantityKeywords()
  let languagesKeywords = getLanguagesKeywords()

  let regexMatchPhrase1 = new RegExp(
    `(${prefixQuantityKeywords})[ ]+([0-9]{1,2})[ ]+(${suffixQuantityKeywords})`,
    "i"
  )
  let regexMatchPhrase2 = new RegExp(
    `(${prefixQuantityKeywords})[ ]+([0-9]{1,2})[ ]*(${languagesKeywords})[ ]*(${suffixQuantityKeywords})`,
    "i"
  )
  let regexMatchPhrase3 = new RegExp(
    `(${prefixQuantityKeywords})[ ]*(${suffixQuantityKeywords})[ #,().]+[ ]*(${languagesKeywords})(?:[\n ]|$)`,
    "i"
  )
  let regexMatchPhrase4 = new RegExp(
    `(${prefixQuantityKeywords})[ ]+([0-9]{1,2})[ #,().]+(${languagesKeywords})(?:[\n ]|$)`,
    "i"
  )
  let regexMatchPhrase5 = new RegExp(
    `(${prefixQuantityKeywords})[ #,().]+(${languagesKeywords})(?:[\n ]|$)`,
    "i"
  )

  let lines = contentToLines(content)
  var matchedParagraph = []
  let isChosen = false
  var paragraph = ""
  lines.forEach((line, index) => {
    let test
    if (!test) {
      test = regexMatchPhrase1.test(line)
      if (test && DEVELOPMENT) console.log("paragraph", regexMatchPhrase1)
    }
    if (!test) {
      test = regexMatchPhrase2.test(line)
      if (test && DEVELOPMENT) console.log("paragraph", regexMatchPhrase2)
    }
    if (!test) {
      test = regexMatchPhrase3.test(line)
      if (test && DEVELOPMENT) console.log("paragraph", regexMatchPhrase3)
    }
    if (!test) {
      test = regexMatchPhrase4.test(line)
      if (test && DEVELOPMENT) console.log("paragraph", regexMatchPhrase4)
    }
    if (!test) {
      test = regexMatchPhrase5.test(line)
      if (test && DEVELOPMENT) console.log("paragraph", regexMatchPhrase5)
    }

    if (test)
      if (test && isChosen) {
        matchedParagraph.push(paragraph)
        paragraph = ""
        isChosen = false
      }
    if (test && !isChosen) isChosen = true

    if (isChosen) {
      paragraph += `${line}\n`
    }
    if (index === lines.length - 1) {
      matchedParagraph.push(paragraph)
      paragraph = ""
      isChosen = false
    }
  })
  if (matchedParagraph.length === 1 && matchedParagraph[0] === "") return []
  return matchedParagraph
}

function searchForHiringPhrase(paragraph) {
  // first phase
  let result
  // let language
  // let quantity
  result = searchForHiringPhraseFirstPhase(paragraph)

  return result
}

function searchForHiringPhraseSpecialCase(content) {
  let suffixKeyword, match
  let languages = []
  //let prefixQuantityKeywords = getPrefixQuantityKeywords()
  let suffixQuantityKeywords = getSuffixQuantityKeywords()
  let languagesKeywords = getLanguagesKeywords()

  let firstPhaseRegExp = new RegExp(
    `(${suffixQuantityKeywords})[ #,().]+(${languagesKeywords})(?:[\\n ]|$)`,
    "gi"
  )

  if (DEVELOPMENT) console.log("SPECIAL CASE", firstPhaseRegExp)

  match = [...content.matchAll(firstPhaseRegExp)]

  if (match.length !== 0) {
    match = match[0]
    suffixKeyword = match[1]
    let languageKeyword = match[2]
    if (suffixKeyword && languageKeyword) {
      languages = [findLanguageKey(languageKeyword)]
      return {
        quantity: 1,
        languages,
      }
    }
  }

  let dashedLanguagesKeywords = languagesKeywords.replace(/[\s]/g, "_")

  let secondPhaseRegExp = new RegExp(
    `(${suffixQuantityKeywords})[ #,()._]+(${dashedLanguagesKeywords})(?:[\\n #,()._]|$)`,
    "gi"
  )

  if (DEVELOPMENT) console.log("SPECIAL CASE", secondPhaseRegExp)

  match = [...content.matchAll(secondPhaseRegExp)]
  if (match.length !== 0) {
    match = match[0]
    suffixKeyword = match[1]
    let languageKeyword = (match[2] + "").replace("_", " ")
    if (suffixKeyword && languageKeyword) {
      languages = [findLanguageKey(languageKeyword)]
      return {
        quantity: 1,
        languages,
      }
    }
  }
}

function searchForHiringPhraseFirstPhase(paragraph) {
  let quantity, prefixKeyword, suffixKeyword, match
  let languages = []
  let prefixQuantityKeywords = getPrefixQuantityKeywords()
  let suffixQuantityKeywords = getSuffixQuantityKeywords()
  let languagesKeywords = getLanguagesKeywords()
  let conjunctionsKeywords = getConjunctionsKeywords()
  let regexMatchPhraseWithConjunctions = new RegExp(
    `(${prefixQuantityKeywords})[ ]*([0-9]+)?[ ]*(${suffixQuantityKeywords})?[ ]*(${languagesKeywords})[ ]*(${suffixQuantityKeywords})?[ ]*(${conjunctionsKeywords})[ ]*([0-9]+)?[ ]*(${suffixQuantityKeywords})?[ ]*(${languagesKeywords})[ ]*(${suffixQuantityKeywords})?`,
    "gi"
  )

  if (DEVELOPMENT) console.log(regexMatchPhraseWithConjunctions)

  match = [...paragraph.matchAll(regexMatchPhraseWithConjunctions)]
  if (match.length !== 0) {
    match = match[0]
    let firstQuantity = match[2]
    prefixKeyword = match[1]
    let secondQuantity = match[7]
    let firstLanguage = match[4]
    let secondLanguage = match[9]
    if (prefixKeyword) {
      let multipleLanguages = []
      if (firstLanguage) {
        let language = findLanguageKey(firstLanguage)
        multipleLanguages.push(language)
      }
      if (secondLanguage) {
        let language = findLanguageKey(secondLanguage)
        multipleLanguages.push(language)
      }
      return multipleLanguages.map((language, index) => {
        let quantity
        if (index === 0) quantity = firstQuantity
        if (index === 1) quantity = secondQuantity
        return {
          languages: [language],
          quantity,
        }
      })
    }
  }

  let firstPhaseRegExp = new RegExp(
    `(${prefixQuantityKeywords})[ ]+([0-9]{1,2})[ ]+(${suffixQuantityKeywords})`,
    "gi"
  )

  if (DEVELOPMENT) console.log(firstPhaseRegExp)

  match = [...paragraph.matchAll(firstPhaseRegExp)]
  if (match.length !== 0) {
    match = match[0]
    quantity = match[2]
    prefixKeyword = match[1]
    suffixKeyword = match[3]
    if (quantity && prefixKeyword && suffixKeyword) {
      languages = [searchForFirstLanguage(paragraph)]
      return {
        quantity: +quantity,
        languages,
      }
    }
  }

  let secondPhaseRegExp = new RegExp(
    `(${prefixQuantityKeywords})[ ]+([0-9]{1,2})[ ]*(${languagesKeywords})[ ]*(${suffixQuantityKeywords})`,
    "gi"
  )

  if (DEVELOPMENT) console.log(secondPhaseRegExp)

  match = [...paragraph.matchAll(secondPhaseRegExp)]
  if (match.length !== 0) {
    match = match[0]
    prefixKeyword = match[1]
    quantity = match[2]
    if (prefixKeyword && quantity) {
      languages = [searchForFirstLanguage(paragraph)]
      return {
        quantity: +quantity,
        languages,
      }
    }
  }

  let thirdPhaseRegExp = new RegExp(
    `(${prefixQuantityKeywords})[ ]*(${suffixQuantityKeywords})[ #,().]+[ ]*(${languagesKeywords})(?:[\n ]|$)`,
    "gi"
  )

  if (DEVELOPMENT) console.log(thirdPhaseRegExp)

  match = [...paragraph.matchAll(thirdPhaseRegExp)]
  if (match.length !== 0) {
    match = match[0]
    prefixKeyword = match[1]
    suffixKeyword = match[2]
    let languageKeyword = match[3]
    if (prefixKeyword && languageKeyword && suffixKeyword) {
      languages = [searchForFirstLanguage(paragraph)]
      return {
        quantity: 1,
        languages,
      }
    }
  }

  let fourthPhaseRegExp = new RegExp(
    `(${prefixQuantityKeywords})[ ]+([0-9]{1,2})[ #,().]+(${languagesKeywords})(?:[\n ]|$)`,
    "gi"
  )

  if (DEVELOPMENT) console.log(fourthPhaseRegExp)

  match = [...paragraph.matchAll(fourthPhaseRegExp)]
  if (match.length !== 0) {
    match = match[0]
    prefixKeyword = match[1]
    quantity = match[2]
    let languageKeyword = match[3]
    if (prefixKeyword && languageKeyword) {
      languages = [searchForFirstLanguage(paragraph)]
      return {
        quantity: +quantity,
        languages,
      }
    }
  }

  let fifthPhaseRegExp = new RegExp(
    `(${prefixQuantityKeywords})[ #,().]+[ ]*(${languagesKeywords})(?:[\n ]|$)`,
    "gi"
  )

  if (DEVELOPMENT) console.log(fifthPhaseRegExp)

  match = [...paragraph.matchAll(fifthPhaseRegExp)]
  if (match.length !== 0) {
    match = match[0]
    prefixKeyword = match[1]
    let languageKeyword = match[2]
    if (prefixKeyword && languageKeyword) {
      languages = [searchForFirstLanguage(paragraph)]
      return {
        quantity: 1,
        languages,
      }
    }
  }

  return {
    quantity,
    languages,
  }
}

function searchForFirstLanguage(paragraph) {
  let joinedLanguages = getJoinedLanguages()
  let { languages } = getKeywords()
  let lowerCaseContent = paragraph.toLowerCase()
  let searchLanguagesWithSpaces = joinedLanguages.filter((language) =>
    language.toLowerCase().includes(" ")
  )
  let searchLanguagesWithDash = searchLanguagesWithSpaces.map((language) =>
    language.replace(" ", "_")
  )
  let languagesToFind = [...joinedLanguages, ...searchLanguagesWithDash].sort(
    (a, b) => b.length - a.length
  )

  let searchedLanguages = languagesToFind.map((language) => {
    let searchLanguage = language.length < 3 ? language : language.toLowerCase()
    let content = language.length < 3 ? paragraph : lowerCaseContent
    let found = false
    let position
    searchLanguage = searchLanguage.replace(/[.*+?^${}()[\]\\]/g, "\\$&")
    ;[
      ` ${searchLanguage} `,
      ` ${searchLanguage}:`,
      ` ${searchLanguage}\n`,
      `#${searchLanguage}`,
      ` ${searchLanguage},`,
      `\\*${searchLanguage}\\*`,
      `/${searchLanguage}/`,
      ` ${searchLanguage}/`,
      ` ${searchLanguage}$`,
      `\\( ${searchLanguage}\\)`,
      `\\( ${searchLanguage} \\)`,
      `\\(${searchLanguage} `,
      `\\(${searchLanguage}, `,
      `\\(${searchLanguage} , `,
      `\\(${searchLanguage}\\)`,
    ].forEach((pattern) => {
      if (found) {
        return
      }
      let regexp = new RegExp(pattern)
      position = content.search(regexp)
      if (position !== -1) found = true
    })
    return {
      language,
      position,
    }
  })
  let filteredSearchedLanguages = searchedLanguages
    .filter((language) => language.position >= 0)
    .sort((a, b) => a.position - b.position)
    .map((language) => language.language)
  let qualifiedLanguages = uniq(
    filteredSearchedLanguages.map((language) => {
      let record = find(languages, function(o) {
        return o.values.includes(language)
      })
      return record.key
    })
  )
  return qualifiedLanguages[0]
}

function findLanguageKey(queryLanguage) {
  let { languages } = getKeywords()
  let filteredLanguages = languages.filter((language) => {
    let a = language.values.filter((language) => {
      return language.toLowerCase() === queryLanguage.toLowerCase()
    }).length
    return a
  })
  return filteredLanguages[0].key
}

function checkTypeOfList(content) {
  // Languages
  // const { languages } = keywords
  // let joinedLanguages = languages
  //   .map((language) => [...language.values])
  //   .reduce((acc, cur) => acc.concat(cur), [])
  //   .sort((a, b) => b.length - a.length)
  //
  let listRegExp = /^[ ]*((?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|-|>|\+|##)|(?:[0-9]+))[ ]*([0-9]{0,2}[:.)/]?)[ ]*/i
  if (DEVELOPMENT) console.log("List Check", listRegExp)
  const contentLines = contentToLines(content)
  let possibleListLines = []
  contentLines.forEach((line, index) => {
    let match = line.match(listRegExp)
    if (!match) return
    let listStyleFirst = match[1].trim()
    let listStyleSecond = match[2].trim()
    if (match)
      possibleListLines.push({
        nth: index + 1,
        text: line,
        listStyleFirst,
        listStyleSecond,
      })
  })
  if (possibleListLines.length === 0) return false
  let {
    orderedListsByListStyleFirst,
    orderedListsByListStyleSecond,
  } = checkOrderedList(possibleListLines)
  console.log("orderedListsByListStyleFirst", orderedListsByListStyleFirst)
  console.log("orderedListsByListStyleSecond", orderedListsByListStyleSecond)
  let arrayOfJobs = []

  if (orderedListsByListStyleFirst.length !== 0) {
    let allListParagraphs
    orderedListsByListStyleFirst.forEach((list) => {
      let arrayOfNth = list.map((line) => line.nth)
      allListParagraphs = arrayOfNth.map((nth, index) => {
        let { listStyleFirst, listStyleSecond } = list[index]
        let listParagraph = []
        let endLineNth = arrayOfNth[index + 1] - 1 || contentLines.length
        for (let i = nth - 1; i < endLineNth; i++) {
          listParagraph.push(contentLines[i])
        }
        return {
          paragraphLines: listParagraph,
          listStyleFirst,
          listStyleSecond,
        }
      })
      let arrayOfJobsInFirstLines = allListParagraphs.map((paragraph) => {
        let firstLineText = paragraph.paragraphLines[0]
        let { listStyleSecond } = paragraph
        if (hasAnyNumber(listStyleSecond)) {
          return {
            quantity: +listStyleSecond,
            languages: [searchForFirstLanguage(firstLineText)],
          }
        }
        let quantity = searchForQuantity(firstLineText)
        return {
          quantity: quantity || 1,
          languages: [searchForFirstLanguage(firstLineText)],
        }
      })
      let arrayOfJobsInFirstLinesHasAnyJob = arrayOfJobsInFirstLines.some(
        (job) => job.languages[0] !== undefined
      )

      arrayOfJobs = arrayOfJobsInFirstLines

      if (arrayOfJobsInFirstLinesHasAnyJob) {
        let arrayOfJobsInParagraphs = allListParagraphs.map((paragraph) => {
          let paragraphText = paragraph.paragraphLines.join("\n")
          let { listStyleSecond } = paragraph
          if (hasAnyNumber(listStyleSecond)) {
            return {
              quantity: +listStyleSecond,
              languages: [searchForFirstLanguage(paragraphText)],
            }
          }
          let quantity = searchForQuantity(paragraphText)
          return {
            quantity: quantity || 1,
            languages: [searchForFirstLanguage(paragraphText)],
          }
        })
        arrayOfJobs = arrayOfJobsInParagraphs
      }
    })
  }

  // if (orderedListsByListStyleSecond.length !== 0) {
  //   orderedListsByListStyleSecond.forEach((list) => {
  //     list.forEach((line) => {
  //       let { text: lineText, listStyleFirst, listStyleSecond } = line
  //     })
  //   })
  // }

  if (
    orderedListsByListStyleFirst.length === 0 &&
    orderedListsByListStyleSecond.length === 0
  ) {
    let jobs = checkUnorderedListLines(possibleListLines, content)
    arrayOfJobs = jobs
  }

  let arrayOfJobsLength = arrayOfJobs.length

  if (arrayOfJobsLength !== 0) {
    let groupByArrayOfJobs = groupBy(arrayOfJobs, function(o) {
      return o.languages[0]
    })
    let notFoundJobs = groupByArrayOfJobs["undefined"]
    let returnArrayOfJobs = arrayOfJobs
    if (notFoundJobs) {
      let undefinedLength = notFoundJobs.length
      if (undefinedLength / arrayOfJobsLength > 0.65 && undefinedLength >= 3) {
        returnArrayOfJobs = arrayOfJobs.filter((job) => job.languages[0])
      }
    }
    return returnArrayOfJobs
  }

  console.log("no list found.")

  return false
}

function checkUnorderedListLines(lines) {
  let arrayOfJobs = []

  // const contentLines = contentToLines(content)
  // let listRegExp = /^[ ]*((?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|-|>|\+|##)|(?:[0-9]+))[ ]*([0-9]{0,2}[:.)/]?)[ ]*/i
  // let possibleListLines = lines
  // contentLines.forEach((line, index) => {
  //   let match = line.match(listRegExp)
  //   if (!match) return
  //   let listStyleFirst = match[1].trim()
  //   let listStyleSecond = match[2].trim()
  //   if (match)
  //     possibleListLines.push({
  //       nth: index + 1,
  //       text: line,
  //       listStyleFirst,
  //       listStyleSecond,
  //     })
  // })

  // let arrayOfNth = possibleListLines.map((line) => line.nth)
  // console.log(arrayOfNth)
  // let allListParagraphs = arrayOfNth.map((nth, index) => {
  //   let { listStyleFirst, listStyleSecond } = possibleListLines[index]
  //   let listParagraph = []
  //   let endLineNth = arrayOfNth[index + 1] - 1 || contentLines.length
  //   for (let i = nth - 1; i < endLineNth; i++) {
  //     listParagraph.push(contentLines[i])
  //   }
  //   return {
  //     paragraphLines: listParagraph,
  //     listStyleFirst,
  //     listStyleSecond,
  //   }
  // })

  // console.log(allListParagraphs)

  let linesWithNumberListStyle = lines.filter((line) => {
    let { listStyleSecond } = line
    return hasAnyNumber(listStyleSecond)
  })

  if(!linesWithNumberListStyle) return []

  console.log(linesWithNumberListStyle)

  if(!linesWithNumberListStyle.length) return []

  arrayOfJobs = linesWithNumberListStyle.map((lineType) => {
    return {
      quantity: +lineType.listStyleSecond || 1,
      languages: [searchForFirstLanguage(lineType.text)],
    }
  })

  let arrayOfJobsLength = arrayOfJobs.length

  if (arrayOfJobsLength !== 0) {
    let groupByArrayOfJobs = groupBy(arrayOfJobs, function(o) {
      return o.languages[0]
    })
    let notFoundJobs = groupByArrayOfJobs["undefined"]
    let returnArrayOfJobs = arrayOfJobs
    if (notFoundJobs) {
      let linesLength = lines.length
      console.log(linesLength)
      if (arrayOfJobsLength / linesLength < 0.5 && linesLength >= 3) {
        returnArrayOfJobs = arrayOfJobs.filter((job) => job.languages[0])
      }
    }
    return returnArrayOfJobs
  }

  return arrayOfJobs
}

function searchForQuantity(content) {
  let prefix_quantity_keywords = getPrefixQuantityKeywords()
  let suffix_quantity_keywords = getSuffixQuantityKeywords()
  let languages_keywords = getLanguagesKeywords()

  let regex = new RegExp(
    `(${prefix_quantity_keywords})+[: .]*([0-9]*)[: ]*([ ]*((${suffix_quantity_keywords})[ ]*)*)*[( ]+((?:(?:${languages_keywords})(?:, | or )*)+)`,
    "gi"
  )
  let lowerCaseContent = content.toLowerCase()
  let exec = lowerCaseContent.matchAll(regex)

  let matches = [...exec]
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
    let regex = new RegExp(
      `(${prefix_quantity_keywords})+[: .]*([0-9]+) (${languages_keywords})`,
      "gi"
    )
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

  return qualifiedQuantity
}

function checkOrderedList(lines) {
  let linesWithNumberListStyle = lines.filter((line) => {
    let { listStyleFirst, listStyleSecond } = line
    return hasAnyNumber(listStyleFirst) || hasAnyNumber(listStyleSecond)
  })
  // check listStyleFirst
  let orderedListsByListStyleFirst = [[]]
  let listIndex = 0
  let lineCurrentValue
  let linePreviousValue = 0
  linesWithNumberListStyle.forEach((line) => {
    let listStyleFirstOnlyNumber = line.listStyleFirst.replace(/\D/g, "")
    if (!listStyleFirstOnlyNumber) return
    lineCurrentValue = +listStyleFirstOnlyNumber
    if (isNaN(lineCurrentValue)) return
    if (lineCurrentValue === linePreviousValue + 1) {
      orderedListsByListStyleFirst[listIndex].push(line)
    } else {
      orderedListsByListStyleFirst.push([])
      ++listIndex
      linePreviousValue = 0
      return
    }
    linePreviousValue = +line.listStyleFirst
  })

  orderedListsByListStyleFirst = orderedListsByListStyleFirst.filter(
    (list) => list.length > 1
  )

  let orderedListsByListStyleSecond = [[]]
  listIndex = 0
  lineCurrentValue = 0
  linePreviousValue = 0
  linesWithNumberListStyle.forEach((line) => {
    if (hasAnyNumber(line.listStyleFirst)) return
    let listStyleSecondOnlyNumber = line.listStyleSecond.replace(/\D/g, "")
    if (!listStyleSecondOnlyNumber) return
    lineCurrentValue = +listStyleSecondOnlyNumber
    if (isNaN(lineCurrentValue)) return
    if (lineCurrentValue === linePreviousValue + 1) {
      orderedListsByListStyleSecond[listIndex].push(line)
    } else {
      orderedListsByListStyleSecond.push([])
      ++listIndex
      linePreviousValue = 0
      return
    }
    linePreviousValue = +line.listStyleSecond
  })
  orderedListsByListStyleSecond = orderedListsByListStyleSecond.filter(
    (list) => {
      return list.length > 1
    }
  )

  return {
    orderedListsByListStyleFirst,
    orderedListsByListStyleSecond,
  }
}

function hasAnyNumber(string) {
  let numberRegExp = /\d/g
  return numberRegExp.test(string)
}

function companyExtractor(content) {
  let joinedCompany = getJoinedCompany()
  let { company } = getKeywords()
  if (!content) return ""
  const lowerCaseContent = content.toLowerCase()
  const companyExtracted = joinedCompany.filter((item) => {
    let itemLength = item.length
    let itemPattern = itemLength > 3 ? item.toLowerCase() : item
    return itemLength > 3 ? lowerCaseContent.includes(itemPattern) : content.includes(item)
  })
  let chosenCompany
  if (companyExtracted) chosenCompany = companyExtracted[0]
  if (!chosenCompany) return ""
  let record = find(company, function(o) {
    return o.values.includes(chosenCompany)
  })
  return record.key
}

function contentToLines(content) {
  let regexToLines = new RegExp(/[^\r\n]+/, "g")
  let arrayOfLines = content.match(regexToLines)
  return arrayOfLines
}

function getPrefixQuantityKeywords() {
  const { prefix_quantity } = getKeywords()
  let prefix_quantity_keywords = prefix_quantity
    .sort(function(a, b) {
      return b.length - a.length
    })
    .join("|")
    .replace(/[.*+?^${}()[\]\\]/g, "\\$&")
  return prefix_quantity_keywords
}

function getSuffixQuantityKeywords() {
  const { suffix_quantity } = getKeywords()
  let suffix_quantity_keywords = suffix_quantity
    .sort(function(a, b) {
      return b.length - a.length
    })
    .join("|")
    .replace(/[.*+?^${}()[\]\\]/g, "\\$&")
  return suffix_quantity_keywords
}

function getLanguagesKeywords() {
  const { languages } = getKeywords()
  let joinedLanguages = languages
    .map((language) => [...language.values])
    .reduce((acc, cur) => acc.concat(cur), [])
  let languages_keywords = joinedLanguages
    .sort(function(a, b) {
      return b.length - a.length
    })
    .join("|")
    .replace(/[.*+?^${}()[\]\\]/g, "\\$&")
  return languages_keywords
}

function getJoinedLanguages() {
  const { languages } = getKeywords()
  let joinedLanguages = languages
    .map((language) => [...language.values])
    .reduce((acc, cur) => acc.concat(cur), [])
    .sort((a, b) => b.length - a.length)
  return joinedLanguages
}

function getJoinedCompany() {
  const { company } = getKeywords()
  let joinedCompany = company
    .map((com) => [...com.values])
    .reduce((acc, cur) => acc.concat(cur), [])
  return joinedCompany
}

function getConjunctionsKeywords() {
  const { conjunctions } = getKeywords()
  return conjunctions
    .sort(function(a, b) {
      return b.length - a.length
    })
    .join("|")
    .replace(/[.*+?^${}()[\]\\]/g, "\\$&")
}
