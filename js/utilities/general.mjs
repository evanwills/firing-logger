import { invalidStrNum, invalidBool } from './validation.mjs'
import { getMetaFromID } from './sanitisation.mjs'

export const fieldHandler = (postToWorker) => function (e) {
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
