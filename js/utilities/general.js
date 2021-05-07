import { invalidStrNum, invalidBool } from './validation.js'
import { getMetaFromID } from './sanitisation.js'

export const fieldHandler = (postToWorker) => function (e) {
  postToWorker({
    metadata: getMetaFromID(this.id),
    value: (invalidStrNum('val', this)) ? this.val : null,
    isChecked: (invalidBool('checked', this, true)),
    now: Date.now()
  })
}



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
