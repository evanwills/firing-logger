import { invalidStrNum, invalidBool } from './validation.mjs'
import { getMetaFromID } from './sanitisation.mjs'

export const fieldHandler = (postToWorker) => function (e) {
  postToWorker({
    metadata: getMetaFromID(this.id),
    value: (invalidStrNum('val', this)) ? this.val : null,
    isChecked: (invalidBool('checked', this, true)),
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
 * Get a unique ID for each regex pair
 *
 * ID is the last nine digits of JS timestamp prefixed with the
 * letter "R"
 *
 * NOTE: The number just short of 1 billion milliseconds
 *       or rougly equivalent to 11.5 days
 *
 * @returns {string}
 */
export const getNewID = () => {
  const tmpDate = new Date()
  const iso = tmpDate.toISOString()
  return 'L' + iso.replace(/[^0-9-T]+/g, '-')
}
