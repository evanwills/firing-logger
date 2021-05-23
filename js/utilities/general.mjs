import { invalidStrNum, invalidBool, isNonEmptyStr, isNumeric } from './validation.mjs'
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
 * Convert degrees Fahrenheit to degrees Celsius
 *
 * @param {number} degrees Degrees Fahrenheit
 *
 * @returns {number} Degrees Celsius
 */
export const f2c = (degrees) => ((degrees - 32) / 1.8)

/**
 * Convert degrees Celsius to degrees Fahrenheit
 *
 * @param {number} degrees Degrees Celsius
 *
 * @returns {number} Degrees Fahrenheit
 */
export const c2f = (degrees) => ((degrees * 1.8) + 32)

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

  return window.btoa(
    // remove microseconds from timestamp
    window.btoa(time.toString().replace(/[0-9]{3}$/, '')) +
    '-' +
    window.btoa(id)
  )
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
