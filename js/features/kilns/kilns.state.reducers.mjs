import {
  validInstallDate,
  validKilnType,
  validfuelSource,
  validMaxTemp,
  validateDimension
} from './kiln-utils.mjs'
import {
  // invalidBool,
  invalidObject,
  invalidString,
  isBoolTrue
} from '../../utilities/validation.mjs'
import { kilnActions } from './kilns.state.actions.mjs'
import { getID } from '../../utilities/general.mjs'
import { isObject } from '../../utilities/validation.mjs'
import { replaceUpdatedById } from '../../utilities/general.mjs'

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
  rawGlaze: false,
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
const updateKiln = (kiln, field, value, force) => {
  const _force = isBoolTrue(force)

  console.group('updateKiln()')
  console.log('kiln:', kiln)
  console.log('field:', field)
  console.log('value:', value)
  console.log('force:', _force)
  console.log('_force:', force)

  if (typeof kiln[field] === typeof value) {
    if (kiln[field] !== value) {
      let newValue = null

      if (_force) {
        // These values should only be set when kiln object is first created
        // However, we are being forced to updated them so we will.
        // (Presumably someone made a mistake)
        try {
          switch (field) {
            case 'installDate':
              newValue = validInstallDate(value)
              break

            case 'type':
              newValue = validKilnType(value)
              break

            case 'fuel':
              newValue = validfuelSource(value)
              break

            case 'maxTemp':
              newValue = validMaxTemp(value)
              break

            case 'depth':
            case 'height':
            case 'width':
              newValue = validateDimension(value, field, kiln.type)
              break

            case 'brand':
            case 'name':
            case 'model':
            case 'glaze':
            case 'bisque':
            case 'rawGlaze':
            case 'celsius':
            case 'isWorking':
            case 'isInUse':
            case 'isHot':
              newValue = value
              break

            default:
              console.error('Cannot set ' + field + ' property on kiln object.')
          }
        } catch (e) {
          console.error(e)
        }
      }
      console.log('newValue:', newValue)

      if (newValue !== null) {
        const output = { ...kiln }
        output[field] = newValue
        console.log('output:', output)
        console.groupEnd()
        return output
      }
    }
  }

  console.groupEnd()
  return kiln
}

const commitKiln = (kiln, allKilns, action) => {
  const { mode, errors, lastField, confirmed, ..._kiln } = kiln

  if (!isObject(errors) && Object.keys(errors).length > 0) {
    // This kiln has errors so we can't commit it yet
    return allKilns
  }

  if (mode === kilnActions.UPDATE) {
    return replaceUpdatedById(allKilns, _kiln)
  } else {
    // We are either in ADD or CLONE mode
    _kiln.id = getID(action.now)
    _kiln.isWorking = false
    _kiln.isRetired = false
    _kiln.isInUse = false
    _kiln.isHot = false
    _kiln.isInUse = false
    _kiln.useCount = 0
    return _kiln
  }
}

export const kilnReducer = (state = initialKilnState, action) => {
  const ID = (!invalidObject('payload', action) && !invalidString('id', action.payload))
    ? action.payload.id
    : ''

  // console.group('kilnReducer()')
  // console.log('kilnActions:', kilnActions)
  // console.log('action.type:', action.type)
  // console.log(
  //   action.type + ' ==== ' + kilnActions.TMP_SET + ':',
  //   action.type === kilnActions.TMP_SET
  // )

  switch (action.type) {
    // case kilnActions.ADD:
    // case kilnActions.UPDATE:
    // case kilnActions.CLONE:
    //   console.groupEnd()
    //   return {
    //     ...state,
    //     tmp: action.payload.value
    //   }

    case kilnActions.DELETE:
      // console.groupEnd()
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
      // console.groupEnd()
      return {
        ...state,
        all: state.all.map(kiln => {
          if (kiln.id === ID) {
            return { ...kiln, isWorking: !kiln.isWorking }
          } else {
            return kiln
          }
        }),
        tmp: (!invalidString('id', state.tmp) && ID === state.tmp.id)
          ? { ...state.tmp, isWorking: !state.tmp.isWorking }
          : state.tmp
      }

    case kilnActions.TMP_COMMIT:
      // console.groupEnd()
      return {
        ...state,
        all: commitKiln(state.tmp, state.all),
        tmp: {}
      }

    case kilnActions.TMP_SET:
      // console.group('kilnReducer()')
      // console.log('kilnActions:', kilnActions)
      // console.log('action.type:', action.type)
      // console.log(
      //   action.type + ' ==== ' + kilnActions.SET_TMP + ':',
      //   action.type === kilnActions.SET_TMP
      // )
      // console.log('action:', action)
      // console.log('action.payload:', action.payload)
      // console.log('action.payload.value:', action.payload.value)
      // // console.log('action:', action)
      // console.groupEnd()
      return {
        ...state,
        tmp: action.payload.value
      }

    case kilnActions.TMP_UPDATE_FIELD:
      // console.group('kilnReducer()')
      // console.log('kilnActions:', kilnActions)
      // console.log('action.type:', action.type)
      // console.log(
      //   action.type + ' ==== ' + kilnActions.TMP_UPDATE_FIELD + ':',
      //   action.type === kilnActions.TMP_UPDATE_FIELD
      // )
      // console.log('action:', action)
      // console.log('action.payload:', action.payload)
      // console.log('action.payload.id:', action.payload.id)
      // console.log('action.payload.value:', action.payload.value)
      // // console.log('action:', action)
      // console.groupEnd()
      return {
        ...state,
        tmp: updateKiln(state.tmp, action.payload.id, action.payload.value, true)
      }

    default:
      // console.groupEnd()
      return state
  }
}
