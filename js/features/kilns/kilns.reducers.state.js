import { isBool, isBoolTrue, isNumeric } from '../../utilities/validation.js'
import { kilnActions } from './kilns.actions.state.js'

const dummyKiln = {
  id: 'woodrow1',
  brand: 'woodrow',
  model: '',
  type: 'general',
  energy: 'electric',
  installDate: '2021-05-05T08:54:03+1000',
  maxTemp: 1260,
  height: 450,
  depth: 450,
  width: 450,
  glaze: true,
  bisque: true,
  singleFire: false,
  celsius: true,
  retired: false,
  isWorking: true,
  isInUse: true,
  isHot: false
}

export const initialKilnState = [dummyKiln]

export const validKilnTypes = [
  'general',
  'raku',
  'platter',
  'black firing',
  'annagamma'
]

export const validEnergySources = [
  'electric',
  'gas',
  'wood',
  'oil',
]

const validKilnType = (kilnType) => {
  const _kilnType = kilnType.toLowerCase()
  if (validKilnTypes.indexOf(_kilnType) === -1) {
    throw Error('Kiln object expects `type` property to match one of the following strings: "' + validKilnTypes.join,'", "' + '"')
  }
  return _kilnType
}

const validEnergySource = (source) => {
  const _source = source.toLowerCase()
  if (validEnergySources.indexOf(_source) === -1) {
    throw Error('Kiln object expects `energy` property to match one of the following strings: "' + validEnergySources.join,'", "' + '"')
  }
  return _source
}

const validMaxTemp = (maxTemp) => {
  if (maxTemp < 400 || maxTemp > 1400) {
    throw Error('Kiln object expects `maxTemp` property to be a number between 400 and 1400 degrees')
  }

  return maxTemp
}

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

const validateDimension = (dimension, prop) => {
  if (isNumeric(dimension) && dimension > 100 && dimension < 2000) {
    return dimension
  }

  throw Error('Kiln object expects `' + prop + '` property to be a number between 100 & 2000')
}

export const validateKilnData = (kiln, isNew = false) => {
  const keys = Object.keys(dummyKiln)
  const newKiln = {}
  const optionalKeys = ['retired', 'isWorking', 'isInUse', 'isHot', 'installDate']
  const _isNew = isBoolTrue(isNew);

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

  try {
    newKiln.installDate = validInstallDate(newKiln.installDate, _isNew)
  } catch (e) {
    throw e
  }

  try {
    newKiln.kilnType = validKilnType(newKiln.kilnType)
  } catch (e) {
    throw e
  }

  try {
    newKiln.energy = validEnergySource(newKiln.energy)
  } catch (e) {
    throw e
  }

  try {
    newKiln.maxTemp = validMaxTemp(newKiln.maxTemp)
  } catch (e) {
    throw e
  }

  try {
    newKiln.depth = validateDimension(newKiln.depth, 'depth')
  } catch (e) {
    throw e
  }

  try {
    newKiln.height = validateDimension(newKiln.height, 'height')
  } catch (e) {
    throw e
  }

  try {
    newKiln.width = validateDimension(newKiln.width, 'width')
  } catch (e) {
    throw e
  }

  return newKiln
}

const updateKiln = (kiln, data) => {
  const field = data.field

  if (typeof kiln[field] === typeof data.value) {
    if (kiln[field] !== typeof data.value) {
      let newValue = null

      if (!invalidBool(force, data, true)) {
        // These values should only be set when kiln object is first created
        // However, we are being forced to updated them so we will.
        try {
          switch (field) {
            case 'installDate':
              newValue = validInstallDate(data.value)
              break;

            case 'kilnType':
              newValue = validKilnType(data.value)
              break;

            case 'energy':
              newValue = validEnergySource(data.value)
              break;

            case 'maxTemp':
              newValue = validMaxTemp(data.value)
              break;

            case 'depth':
            case 'height':
            case 'width':
              newValue = validateDimension(data.value, field)
              break

            case 'brand':
            case 'model':
            case 'glaze':
            case 'bisque':
            case 'singleFire':
            case 'celsius':
            case 'isWorking':
            case 'isInUse':
            case 'isHot':
              newValue = data.value

            default:
              console.error('Cannot set ' + field + ' property on kiln object.')
          }
        } catch (e) {
          console.error(e)
        }
      } else {
        newValue = data.value
      }

      if (newValue !== null) {
        const output = { ...kiln }
        output[field] = newValue
        return output
      }
    }
  }
  return kiln
}


export const kilnReducer = (state, action) => {
  const ID = action.payload.id

  switch (action.type) {
    case kilnActions.ADD:
      const exists = state.filter(kiln => (kiln.id === ID))

      if (exists.length > 0) {
        throw Error('Cannot add Kiln with ID "' + ID + '". ID is already in use')
      }
      return [...state, action.payload]

    case kilnActions.UPDATE:
      return state.map(kiln => {
        if (kiln.id === ID) {
          return updateKiln(kiln, action.payload)
        } else {
          return kiln
        }
      })


    case kilnActions.DELETE:
      return state.map(kiln => {
        if (kiln.id === ID) {
          return { ...kiln, retired: true }
        } else {
          return kiln.
        }
      })
  }
}
