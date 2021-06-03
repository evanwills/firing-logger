/**
 * This file contains a number of "pure" utitlity functions used for
 * doing discrete kiln related stasks
 */

import {
  isBoolTrue,
  isInt,
  isNumeric,
  validateUnique,
  validateSafeStr
  // invalidBool
} from '../../utilities/validation.mjs'
import { getISODateStr } from '../../utilities/sanitisation.mjs'
import { kilnActions } from './kilns.state.actions.mjs'

export const validKilnTypes = [
  'general',
  'raku',
  'platter',
  'black firing',
  'anagamma'
]

export const validfuelSources = [
  'electric',
  'gas',
  'wood',
  'oil'
]

export const firingTypes = [{
  label: 'Bisque',
  value: 'bisque'
}, {
  label: 'Black firing',
  value: 'black'
}, {
  label: 'Glaze',
  value: 'glaze'
}, {
  label: 'Luster',
  value: 'luster'
}, {
  label: 'Onglaze',
  value: 'onglaze'
}, {
  label: 'Pit firing',
  value: 'pit'
}, {
  label: 'Raku',
  value: 'raku'
}, {
  label: 'Raw glaze',
  value: 'rawGlaze'
}, {
  label: 'Saggar',
  value: 'saggar'
}, {
  label: 'Salt glaze',
  value: 'saltGlaze'
}]

export const getNewKiln = () => {
  return {
    id: '',
    mode: kilnActions.ADD,
    brand: '',
    model: '',
    name: '',
    installDate: '',
    fuel: '',
    type: '',
    maxTemp: 0,
    width: 0,
    depth: 0,
    height: 0,
    maxProgramCount: 0,
    bisque: true,
    black: false,
    glaze: true,
    luster: true,
    onglaze: true,
    pit: false,
    raku: false,
    rawGlaze: false,
    saggar: false,
    saltGlaze: false,
    retired: false,
    isWorking: false,
    isInUse: false,
    isHot: false,
    useCount: 0
  }
}

export const getTmpKiln = (kiln, mode) => {
  // console.group('getTmpKiln()')
  // console.log('kiln:', kiln)
  // console.log('mode:', mode)
  // console.groupEnd()
  return {
    ...kiln,
    confirmed: false,
    lastField: 'name',
    errors: {},
    mode: mode
  }
}

/**
 *
 * @param {object}   kiln  Program object to be copied/updated
 * @param {bloolean} clone    Whether or not the object is to be
 *                            cloned as a new program or to receive
 *                            updates to the original
 * @param {string}   date     ISO8601 date formatted string
 * @param {string}   username User ID for the user doing the action
 * @returns
 */
export const cloneUpdateKiln = (kiln, clone, date) => {
  const _clone = isBoolTrue(clone)

  const newKiln = {
    ...kiln
  }
  // console.group('cloneUpdateKiln()')

  if (_clone === true) {
    newKiln.name = '{{' + getISODateStr(date) + '}}' + newKiln.name
    newKiln.used = false
    newKiln.retired = false
    newKiln.isHot = false
    newKiln.isInUse = false
    newKiln.isWorking = false
    newKiln.useCount = 0
  }

  // console.log('kiln:', kiln)
  // console.log('newKiln:', newKiln)
  // console.groupEnd()
  return newKiln
}

/**
 * Get the ID of the input field that should be in focus
 *
 * @param {object} errors List of input errors in a form
 * @param {string} lastID ID of the element that was last
 *                        successfully updated
 *
 * @returns {string} ID of the input field that should have focus
 *                   (or empty string if none could be found)
 */
export const getFocusID = (errors, lastID) => {
  const editableFields = ['kilnID', 'name', 'description', 'type', 'controllerProgramID']
  const errorFields = (typeof errors === 'object') ? Object.keys(errors) : []

  // console.group('getFocusID()')
  // console.log('editableFields:', editableFields)
  // console.log('errorFields:', errorFields)
  // console.log('lastID:', lastID)

  if (errorFields.length > 0) {
    // console.log('Go to the first field in error')
    // console.log('errorFields[0]:', errorFields[0])
    // console.groupEnd()
    return errorFields[0]
  } else {
    const i = editableFields.indexOf(lastID)
    if (i > -1) {
      const b = (i + 1)
      if (b < editableFields.length) {
        // console.log('Go to the next field')
        // console.log('editableFields[' + b + ']:', editableFields[b])
        // console.groupEnd()
        return editableFields[b]
      }
    }
  }
  // console.groupEnd()
  return ''
}

/**
 * Test whether the value for the type of kiln is valid
 *
 * @param {string} kilnType Name of the type of kiln
 *
 * @returns {string}
 */
export const validKilnType = (kilnType) => {
  const _kilnType = kilnType.toLowerCase()
  if (validKilnTypes.indexOf(_kilnType) === -1) {
    throw Error('Kiln object expects `type` property to match one of the following strings: "' + validKilnTypes.join('", "') + '"')
  }
  return _kilnType
}

/**
 * Test whether the value for the type of fuel source used by the
 * kiln is valid
 *
 * @param {string} source Name of the type of kiln
 *
 * @returns {string}
 */
export const validfuelSource = (source) => {
  const _source = source.toLowerCase()
  if (validfuelSources.indexOf(_source) === -1) {
    throw Error('Kiln object expects `fuel` property to match one of the following strings: "' + validfuelSources.join('", "') + '"')
  }
  return _source
}

/**
 * Test whether the value supplied for the maximum temperature the
 * kiln can go to is sane.
 *
 * @param {number} source Name of the type of kiln
 *
 * @returns {number}
 */
export const validMaxTemp = (maxTemp) => {
  if (isInt(maxTemp) && (maxTemp < 400 || maxTemp > 1400)) {
    throw Error('Kiln object expects `maxTemp` property to be a number between 400 and 1400 degrees')
  }

  return maxTemp
}

/**
 * Test whether the supplied date is a valid date string
 *
 * @param {string}  installDate Date the kiln was installed
 * @param {boolean} isNew       Whether the date supplied is for a
 *                              new kiln
 *
 * @returns {string} valid date string
 */
export const validInstallDate = (installDate, isNew) => {
  const msg = 'Kiln object expects `installDate` property to be an ISO 8601 date formatted string'

  if (installDate === false) {
    if (isNew) {
      const iso = new Date()
      return iso.toISOString()
    } else {
      throw Error(msg)
    }
  } else if (isNaN(Date.parse(installDate))) {
    throw Error(msg)
  }

  return installDate
}

/**
 * Test whether the dimension supplied (in milimetres) is sane
 *
 * NOTE: Upper limit for sane is normally 2 metres however for
 *       anagama type kilns this not enough so for anagama type
 *       kilns the maximum length is 40 metres
 *
 * @param {number} dimension Number of milimetres the a dimension
 *                           of the packing space of a kiln is
 * @param {string} prop      Which dimension is being tested
 * @param {string} kilnType  Type of kiln the dimension applies to
 * @returns
 */
export const validateDimension = (dimension, prop, kilnType) => {
  const _type = (typeof kilnType === 'string') ? kilnType : 'general'
  const maxLength = (prop === 'depth' && _type === 'anagama') ? 40000 : 2000

  if (isNumeric(dimension) && dimension > 100 && dimension < maxLength) {
    return dimension
  }

  throw Error('Kiln object expects `' + prop + '` property to be a number between 100 & 2000')
}

/**
 * Validate all the data supplied for a new kiln
 *
 * @param {object}  kiln  All the data for the new kiln
 * @param {boolean} isNew Whether or not the data being tested is
 *                        for a new kiln
 * @returns {object} Kiln object with only valid properties.
 */
export const validateKilnData = (dummyKiln, kiln, isNew = false) => {
  const keys = Object.keys(dummyKiln)
  const newKiln = {}
  const optionalKeys = ['retired', 'isWorking', 'isInUse', 'isHot', 'installDate']
  const _isNew = isBoolTrue(isNew)

  // Basic validation - compare data types against dummy object types
  for (let a = 0; a < keys.length; a += 1) {
    if (typeof dummyKiln[keys[a]] === typeof kiln[keys[a]]) {
      newKiln[keys[a]] = typeof kiln[keys[a]]
    } else if (optionalKeys.indexOf(keys[a]) > -1) {
      newKiln[keys[a]] = false
    } else {
      throw Error('Kiln data was missing field "' + keys[a] + '"')
    }
  }

  // Extra validation

  try { // eslint-disable-line
    newKiln.installDate = validInstallDate(newKiln.installDate, _isNew)
  } catch (e) {
    throw e
  }

  try { // eslint-disable-line
    newKiln.kilnType = validKilnType(newKiln.kilnType)
  } catch (e) {
    throw e
  }

  try { // eslint-disable-line
    newKiln.fuel = validfuelSource(newKiln.fuel)
  } catch (e) {
    throw e
  }

  try { // eslint-disable-line
    newKiln.maxTemp = validMaxTemp(newKiln.maxTemp)
  } catch (e) {
    throw e
  }

  try { // eslint-disable-line
    newKiln.depth = validateDimension(newKiln.depth, 'depth', newKiln.kilnType)
  } catch (e) {
    throw e
  }

  try { // eslint-disable-line
    newKiln.height = validateDimension(newKiln.height, 'height')
  } catch (e) {
    throw e
  }

  try { // eslint-disable-line
    newKiln.width = validateDimension(newKiln.width, 'width')
  } catch (e) {
    throw e
  }

  return newKiln
}

const validateKilnName = (kName, allKilns) => {
  console.group('validateKilnName()')
  console.log('kName', kName)
  console.log('allKilns', allKilns)
  try {
    validateUnique(kName, 'name', allKilns)
  } catch (e) {
    console.error('Kiln ' + e)
    return 'Kiln ' + e
  }
  console.groupEnd()
  return false
}

export const isInvalidKilnField = (action, tmpKiln, allKilns) => {
  const { id, value, theRest } = action.payload
  let tmp = ''

  switch (id) {
    case 'name':
      return validateKilnName(value, allKilns)
    case 'brand':
    case 'model':
      return validateSafeStr(value)
    case 'maxTemp':
      return (isInt(value) && value >= 400 && value <= 1400) ? false : 'Maximium temperature must be between 400 degrees & 1400 degrees'
  }
  return false
}
