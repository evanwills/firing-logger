import {
  isBoolTrue,
  isDate,
  isNonEmptyStr,
  isNumeric,
  isStr,
  invalidNum
} from './validation.mjs'
import { cleanGET } from './url.mjs'

/**
 * Convert a string into an array (if possible) and clean up array
 * items
 *
 * @param {string} input String that might contain an array
 *
 * @returns {Array, false}
 */
export const parseStrArray = (input) => {
  const tmp = input.match(/^\[([^\]]*)\]$/)
  const regex = /(?:^|\s*),\s*(?:('|")\s*([^\1]*?)\s*\1|([^,]*?))\s*(?=,|$)/g
  let item
  const output = []

  while ((item = regex.exec(tmp)) !== null) {
    item = cleanGET(item)
    if (item === '') {
      continue
    } else {
      output.push(item)
    }
  }

  if (output.length > 0) {
    // Array is not empty
    return output
  }

  // Input could not be converted to an array or was empty after
  // cleaning
  return false
}

export const getTabI = (input) => {
  return (!isNumeric(input) || input !== -1) ? 0 : -1
}

/**
 * Make a string safe to be used as an ID
 *
 * @param {string} input Value to be used as an ID
 *
 * @returns {string} value that is safe to be used as an ID
 */
export const idSafe = (input) => {
  return input.replace(/[^a-z0-9_-]/ig, '')
}

const propSafeInner = (whole, alpha, num) => {
  const _num = isNumeric(num) ? num : ''
  return alpha.toUpperCase() + _num
}

export const propSafe = (input) => {
  const output = input.replace(/^[^a-z0-9]+|[^a-z0-9]+$/ig, '')
  return output.replace(/^[^a-z0-9]+(?:([a-z])|([0-9]))/ig, propSafeInner)
}

const escapeChars = [
  { find: /\\n/g, replace: '\n' },
  { find: /\\r/g, replace: '\r' },
  { find: /\\t/g, replace: '\t' }
]

/**
 * Convert escaped white space characters to their normal characters
 *
 * @param {string} input Input with escape sequences
 *
 * @returns {string} Output with escape sequences converted to their
 *                   normal characters
 */
export const convertEscaped = (input) => {
  let output = input
  for (let a = 0; a < escapeChars.length; a += 1) {
    output = output.replace(escapeChars[a].find, escapeChars.replace)
  }
  // return escapeChars.reduce((tmp, pair) => tmp.replace(pair[0], pair[1]), input)
  return output
}

/**
 * makeAttributeSafe() makes a string safe to be used as an ID or
 * class name
 *
 * @param {string} _attr A string to be made safe to use as a HTML
 *             class name or ID
 *
 * @returns {string} class name or ID safe string
 */
export const makeAttributeSafe = (_attr) => {
  let _output = ''

  if (typeof _attr !== 'string') {
    throw new Error('makeAttributeSafe() expects only parameter "_attr" to be a non-empty string. ' + typeof _attr + ' given.')
  }

  _output = _attr.replace(/[^a-z0-9_-]+/ig, '')

  if (_output === '') {
    throw new Error('makeAttributeSafe() expects only parameter "_attr" to be string that can be used as an HTML class name or ID. "' + _attr + '" cannot be used. After cleaning, it became an empty string.')
  }

  if (!_output.match(/^[a-z_-]/i)) {
    _output = '_' + _output
  }

  return _output
}

/**
 * Convert String to HTML input safe string
 *
 * @param {string}  input        String to be encoded
 * @param {boolean} doubleEncode Whether or not to double encode entities
 *
 * @returns {string} HTML entity encoded string
 */
export const makeHTMLsafe = (input, doubleEncode, inputField) => {
  const htmlChars = [[/</g, '&lt;'], [/>/g, '&gt;']]
  const amp = [/&/g, '&amp;']
  const findReplace = (typeof doubleEncode === 'boolean' && doubleEncode === true)
    ? [...htmlChars, amp]
    : [amp, ...htmlChars]

  if (isBoolTrue(inputField)) {
    htmlChars.concat([[/'/g, '&apos;'], [/"/g, '&quot;']])
  }

  return findReplace.reduce(
    (accumulator, pair) => accumulator.replace(pair[0], pair[1]),
    input
  )
}

export const ucFirst = (input) => {
  return input.substr(0, 1).toUpperCase() + input.substr(1)
}

/**
 * makeHumanReadableAttr() makes a string safe to be used as an ID or
 * class name
 *
 * @param {string} _attr A string to be made safe to use as a HTML
 *             class name or ID
 *
 * @returns {string} class name or ID safe string
 */
export const makeHumanReadableAttr = (_attr) => {
  let _output = ''

  if (typeof _attr !== 'string') {
    throw new Error('makeAttributeSafe() expects only parameter "_attr" to be a non-empty string. ' + typeof _attr + ' given.')
  }

  _output = _attr.replace(/[^a-z0-9_\\-]+([a-z]?)/ig, (match, p1) => {
    return (typeof p1 !== 'undefined') ? p1.toUpperCase() : ''
  })

  if (_output === '') {
    throw new Error('makeHumanReadableAttr() expects only parameter "_attr" to be string that can be used as an HTML class name or ID. "' + _attr + '" cannot be used. After cleaning, it became an empty string.')
  }

  if (!_output.match(/^[a-z_-]/i)) {
    _output = '_' + _output
  }
  return _output
}

/**
 * Make user group name more human readable
 *
 * @param {string} input Name of user group action belongs to
 *
 * @returns {string} Human readable version of group name
 */
export const groupNameToLabel = (input) => {
  const groupLabel = (whole, num1, letter1, word1, word2) => {
    if (letter1 !== '') {
      return num1 + ' ' + letter1.toUpperCase() + word1
    } else {
      return ' ' + word2
    }
  }

  let output = input.replace(/^([0-9-_]*)([a-z])([a-z]+)|([A-Z][a-z]+)/g, groupLabel)

  output = output.replace(/\s*_+\s*/g, ' ')
  output = output.replace(/\s*-+\s*/g, ' - ')

  return output.trim()
}

export const getMetaFromID = (input) => {
  const _tmp = input.split('-', 4)

  return {
    id: _tmp[0].trim(),
    type: isStr(_tmp[1]) ? _tmp[1].trim() : '',
    extra: isStr(_tmp[2]) ? _tmp[2].trim() : '',
    suffix: isStr(_tmp[3]) ? _tmp[3].trim() : ''
  }
}

/**
 * Get string to use as class name for HTML element
 *
 * @param {object} props       properties for the element
 * @param {string} BEMelement  BEM *element* class name suffix
 * @param {string} BEMmodifier BEM *modifier* class name suffix
 * @param {string} prefix      Prefix for object property name to
 *                             allow for the component to have
 *                             multiple elements with different
 *                             values for the same attribute name
 *
 * @returns {string} HTML element class name
 */
export const getClassName = (props, BEMelement, BEMmodifier, prefix) => {
  const _cls = (isNonEmptyStr(prefix)) ? prefix.trim() + 'Class' : 'class'
  const _suffix = (isNonEmptyStr(BEMelement)) ? '__' + BEMelement.trim() : ''
  const _modifier = (isNonEmptyStr(BEMmodifier)) ? '--' + BEMmodifier.trim() : ''
  let _output = (isStr(props[_cls])) ? props[_cls].trim() : ''

  _output += (_output !== '') ? _suffix : ''
  _output += (_output !== '' && _modifier !== '') ? ' ' + _output + _modifier : ''

  return _output
}

export const getISODateStr = (input) => {
  let tmp = input
  if (isDate(tmp)) {
    if (isNonEmptyStr(tmp)) {
      tmp = new Date(tmp)
    }
    return tmp.toISOString()
  }
  return false
}

export const base64Time = (input) => {
  const output = window.btoa(input)
  return output.replace(/[^a-z0-9]$/i, '')
}

/**
 * Convert the number of seconds (sec) into the number for the
 * unit provided
 *
 * @param {object} param0
 * @returns {object}
 */
const getTimeSubUnit = ({ str, sec, unit, force }) => {
  const units = {
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  }
  const unitSeconds = (!invalidNum(unit, units)) ? units[unit] : 0
  let remain = sec
  let output = ''

  if (unitSeconds > 0) {
    if (force === true) {
      // reset default so that zero units are returned (instead of
      // empty string) when the number of seconds is less than the
      // seconds for the specified unit
      output = '0 ' + unit + 's'
    }

    if (sec > unitSeconds) {
      // get the number of units
      const tmp = Math.floor(sec / unitSeconds)
      const s = (tmp > 1) ? 's' : ''

      // get the left over seconds
      remain = sec - (tmp * unitSeconds)

      // Get the text representation for the unit
      output = tmp + ' ' + unit + s
    }

    if (output !== '' && str.trim() !== '') {
      // Get the right punctuation
      output = ', ' + output
    }
  }

  return {
    str: str + output, // merge supplied string with output
    sec: remain // send back the number of seconds remaining
  }
}

/**
 * Convert a duration value (in seconds) to human readable
 * representation in days, hours, minutes and seconds
 *
 * @param {number} seconds Number of seconds to be translated
 *
 * @returns {string} Human readable represenation of the duration
 */
export const getHourMinSec = (seconds) => {
  let tmp = {
    str: '',
    sec: seconds
  }

  tmp = getTimeSubUnit({ ...tmp, unit: 'day', force: false })
  tmp = getTimeSubUnit({ ...tmp, unit: 'hour', force: false })
  tmp = getTimeSubUnit({ ...tmp, unit: 'minute', force: true })
  tmp = getTimeSubUnit({ ...tmp, unit: 'second', force: false })

  return tmp.str
}
