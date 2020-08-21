export const getUniqueCompanies = (companies) => {
  let clonedCompanies = [...companies]

  let sortedCompanies = clonedCompanies.sort(function(a, b) {
    let aLength = a.length
    let bLength = b.length
    if (aLength > bLength) return -1
    return 1
  })

  let filteredArray = []
  let mappedCompanies = sortedCompanies.map((company) => {
    let companiesArray = [company]
    let aliasCompanies = sortedCompanies.filter((includedCompany) => {
      if (includedCompany === company) return
      let paddingCompany = includedCompany.replace(
        /([A-Z][a-z]+)(?=[A-Z])/g,
        "$1 "
      )
      let test = company.includes(paddingCompany)
      if (test) filteredArray.push(includedCompany)
      return test
    })
    if (filteredArray.includes(company)) return
    companiesArray = [...companiesArray, ...aliasCompanies]
    return {
      values: companiesArray,
      key: company
    }
  })

  let filteringUndefinedCompanies = mappedCompanies.filter((company) => company)

  return filteringUndefinedCompanies
}