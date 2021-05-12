import { isBoolTrue, isInt, isNumeric } from '../../utilities/validation.mjs'

export const validKilnTypes = [
  'general',
  'raku',
  'platter',
  'black firing',
  'anagamma'
]

export const validEnergySources = [
  'electric',
  'gas',
  'wood',
  'oil'
]

/**
 * Test whether the value for the type of kiln is valid
 *
 * @param {string} kilnType Name of the type of kiln
 *
 * @returns {string}
 */
const validKilnType = (kilnType) => {
  const _kilnType = kilnType.toLowerCase()
  if (validKilnTypes.indexOf(_kilnType) === -1) {
    throw Error('Kiln object expects `type` property to match one of the following strings: "' + validKilnTypes.join('", "') + '"')
  }
  return _kilnType
}

/**
 * Test whether the value for the type of energy source used by the
 * kiln is valid
 *
 * @param {string} source Name of the type of kiln
 *
 * @returns {string}
 */
const validEnergySource = (source) => {
  const _source = source.toLowerCase()
  if (validEnergySources.indexOf(_source) === -1) {
    throw Error('Kiln object expects `energy` property to match one of the following strings: "' + validEnergySources.join('", "') + '"')
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
const validMaxTemp = (maxTemp) => {
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
const validInstallDate = (installDate, isNew) => {
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
const validateDimension = (dimension, prop, kilnType) => {
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
    newKiln.energy = validEnergySource(newKiln.energy)
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
