import { invalidStr, invalidStrNum, invalidBool, isNonEmptyStr, isNumeric } from './validation.mjs'
import { getMetaFromID } from './sanitisation.mjs'

export const fieldHandler = (postToWorker) => function (e) {
  e.preventDefault()
  console.log('inside fieldHandler()')
  postToWorker({
    metadata: getMetaFromID(this.id),
    value: (invalidStrNum('val', this)) ? null : this.value,
    isChecked: (invalidBool('checked', this, true) === false),
    now: Date.now()
  })
}

/**
 * Get a unique ID based on the current time
 *
 * ID is a sanitised base64 encoded JS timestamp
 *
 * @returns {string}
 */
export const getUniqueID = () => {
  // Base 64 encode timestamp
  let now = window.btoa(Date.now())

  // remove non-alphanumeric chars from end of string
  now = now.replace(/[^a-z0-9]+$/i, '')

  // Make sure output starts with an alphabetical character
  return now.replace(/^([^a-z]+([a-z]))/i, '$2$1')
}

/**
 * Get Unique ID based on time and name of user creating the thing
 * requiring a new ID
 *
 * @param {string} time Unix timestamp
 * @param {string} user
 *
 * @returns {string} time based UID
 */
export const getID = (time, id) => {
  if (!isNumeric(time)) {
    throw Error('getID() expects first param time to be a number. ' + typeof time + ' given.')
  } else if (time < 65700000000) {
    throw Error('getID() expects first param time to be a number matching a unix timestamp more recent than 2020. ' + time + ' given.')
  } else if (!isNonEmptyStr(id)) {
    throw Error('getID() expects second param `id` to be a non-empty string.')
  }
  const _time = Math.round(time / 60000)

  // return window.btoa(
  //   // remove microseconds from timestamp
  //   window.btoa(time.toString().replace(/[0-9]{3}$/, '')) +
  //   '-' +
  //   window.btoa(id)
  // )
  return window.btoa(_time.toString() + '-' + id)
}

/**
 * Extract data from UID cretaed by getID()
 *
 * @param {string} id UID created by getID
 *
 * @returns {object}
 */
export const decodeID = (id) => {
  if (!isNonEmptyStr(id)) {
    throw Error('decodeID() expects first param `id` to be a non-empty string.')
  }
  let step1 = ''
  try {
    step1 = window.atob(id)
  } catch (e) {
    throw Error('decodeID() expects first param `id` base64 encoded string.' + e)
  }

  const step2 = step1.split('-')

  if (step2.length !== 2) {
    throw Error('decodeID() expects first param `id` to be an encoded Firing Logger ID.')
  }

  return {
    time: step2[0],
    // make timestamp include microseconds before converting to date
    date: new Date(step2[0] * 1000),
    id: step2[1]
  }
}

/**
 * Get the item from the supplied list that matches the given ID
 *
 * @param {array}  itemList List of items to be searched through
 * @param {string} id       ID of item to be returned
 * @param {string} propName [default: "id"] Field name to match
 *                          against
 *
 * @returns {object,false} Matched object or FALSE if not object could be found
 */
export const getItemByID = (itemList, id, propName) => {
  const _id = isNonEmptyStr(id) ? id : ''
  const prop = (isNonEmptyStr(propName) && itemList.length > 0 && !invalidStr(propName, itemList[0])) ? propName : 'id'
  for (let a = 0; a < itemList.length; a += 1) {
    if (itemList[a][prop] === _id) {
      return itemList[a]
    }
  }
  return false
}

/**
 * Get the item from the supplied list that matches the given ID
 *
 * @param {array}  itemList List of items to be searched through
 * @param {string} id       ID of item to be returned
 * @param {string} propName [default: "id"] Field name to match
 *                          against
 *
 * @returns {object,false} Matched object or FALSE if not object could be found
 */
export const getItemsByID = (itemList, id, propName) => {
  const _id = isNonEmptyStr(id) ? id : ''
  const prop = (isNonEmptyStr(propName) && itemList.length > 0 && !invalidStr(propName, itemList[0])) ? propName : 'id'
  return itemList.filter(item => item[prop] === _id)
}

/**
 * Get the value of a property ()
 *
 * @param {array}  itemList List of items to be searched through
 * @param {string} id       ID of item from which property value is
 *                          to be returned
 * @param {string} propName [default: "id"] Field name to match
 *                          against
 *
 * @returns {mixed,null} The matched value or null if no item could
 *                          be found
 */
export const getPropByID = (itemList, id, propName) => {
  const _id = isNonEmptyStr(id) ? id : ''
  const prop = (isNonEmptyStr(propName) && itemList.length > 0 && !invalidStr(propName, itemList[0])) ? propName : 'name'

  const items = itemList.filter(item => item.id === _id).map(item => {
    return (typeof item[prop] !== 'undefined') ? item[prop] : null
  })

  for (let a = 0; a < items.length; a += 1) {
    if (items[a] !== null) {
      return items[a]
    }
  }
  return null
}
