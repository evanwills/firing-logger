import { isBoolTrue, invalidString, invalidNum, isNonEmptyStr } from './validation.mjs'
import { ucFirst } from './sanitisation.mjs'

export const pushNonFalse = (all, func) => {
  return (func !== false) ? [...all, func] : all
}

export const getMinMaxFilter = (funcList, filters, prop, prop1) => {
  const minP = 'min' + ucFirst(prop)
  const maxP = 'max' + ucFirst(prop)

  const _prop = (isNonEmptyStr(prop1)) ? prop1 : prop

  const min = (!invalidNum(minP, filters) && filters[minP] > -1) ? filters[minP] : -1
  const max = (!invalidNum(maxP, filters) && filters[maxP] > -1) ? filters[maxP] : -1

  let func = false
  if (min > -1) {
    if (max > -1) {
      func = (item) => (item[_prop] >= min && item[_prop] <= max)
    } else {
      func = (item) => (item[_prop] >= min)
    }
  } else if (max > -1) {
    func = (item) => (item[_prop] <= max)
  }

  return pushNonFalse(funcList, func)
}

export const getBoolfilter = (funcList, filters, prop) => {
  if (!invalidNum(prop, filters) && (filters[prop] === 0 || filters[prop] === 1)) {
    const val = (filters[prop] === 1)

    return [...funcList, (item) => item[prop] === val]
  }
  return funcList
}

/**
 *
 * @param {array} funcList
 * @param {object} filters
 * @param {string} prop
 * @param {boolean} simple
 * @returns {array}
 */
export const getStringMatchFilter = (funcList, filters, prop, simple) => {
  const basic = isBoolTrue(simple)

  let func = false
  if (!invalidString(prop, filters, true)) {
    const val = filters[prop]
    if (basic) {
      func = (item) => item[prop] === val
    } else {
      // Lets see if we can create
      let regex = false
      try {
        regex = new RegExp(filters.name, 'i')
      } catch (e) {
        console.warning('Could not create regex pattern')
      }
      if (regex !== false) {
        // This string could successfully be converted into a regex
        func = (item) => regex.test(item.name)
      } else {
        // This string is only a simple string match
        func = (item) => (item.name.indexOf(filters.name) > -1)
      }
    }
  }

  return pushNonFalse(funcList, func)
}

export const getFilterFunc = (filters) => {
  const l = filters.length

  return (program) => {
    for (let a = 0; a < l; a += 1) {
      if (!filters[a](program)) {
        return false
      }
    }
    return true
  }
}
