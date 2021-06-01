import {
  validInstallDate,
  validKilnType,
  validfuelSource,
  validMaxTemp,
  validateDimension
} from './kiln-utils.mjs'
import {
  invalidBool
} from '../../utilities/validation.mjs'
import { kilnActions } from './kilns.state.actions.mjs'

const dummyKiln = {
  id: 'woodrow1',
  brand: 'woodrow',
  model: '',
  type: 'general',
  fuel: 'electric',
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

export const initialKilnState = {
  all: dummyKiln,
  filters: {}
}

/**
 * Update a single field in a kiln object
 *
 * @param {string} kiln Whole kiln object
 * @param {object} data
 * @returns
 */
const updateKiln = (kiln, data) => {
  const field = data.field
  const val = data.value

  if (typeof kiln[field] === typeof val) {
    if (kiln[field] !== val) {
      let newValue = null

      if (!invalidBool('force', data, true)) {
        // These values should only be set when kiln object is first created
        // However, we are being forced to updated them so we will.
        // (Presumably someone made a mistake)
        try {
          switch (field) {
            case 'installDate':
              newValue = validInstallDate(val)
              break

            case 'kilnType':
              newValue = validKilnType(val)
              break

            case 'fuel':
              newValue = validfuelSource(val)
              break

            case 'maxTemp':
              newValue = validMaxTemp(val)
              break

            case 'depth':
            case 'height':
            case 'width':
              newValue = validateDimension(val, field, kiln.type)
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
              newValue = val
              break

            default:
              console.error('Cannot set ' + field + ' property on kiln object.')
          }
        } catch (e) {
          console.error(e)
        }
      } else {
        newValue = val
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

export const kilnReducer = (state = initialKilnState, action) => {
  const ID = (typeof action.payload !== 'undefined' && typeof action.payload.id === 'string') ? action.payload.id : ''

  switch (action.type) {
    case kilnActions.ADD:
    case kilnActions.UPDATE:
    case kilnActions.CLONE:
      return {
        ...state,
        tmp: action.payload.value
      }

    case kilnActions.DELETE:
      return {
        ...state,
        all: state.all.map(kiln => {
          if (kiln.id === ID) {
            return { ...kiln, retired: true }
          } else {
            return kiln
          }
        })
      }

    case kilnActions.TOGGLE_WORKING:
      return {
        ...state,
        all: state.all.map(kiln => {
          if (kiln.id === ID) {
            return { ...kiln, isWorking: !kiln.isWorking }
          } else {
            return kiln
          }
        })
      }

    case kilnActions.SET_TMP:
      return {
        ...state,
        tmp: action.payload.value
      }

    default:
      return state
  }
}
