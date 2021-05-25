import { programActions } from './programs.state.actions.mjs'
import { uniquePogramName, validFiringType } from './programDataValidation.mjs'
import {
  // isBoolTrue,
  invalidBool,
  invalidString,
  invalidNum
} from '../../utilities/validation.mjs'
import { getID } from '../../utilities/general.mjs'
import { getISODateStr, round } from '../../utilities/sanitisation.mjs'
// import { getISODateStr } from '../../utilities/sanitisation.mjs'

export const initialPrograms = [{
  id: 1,
  kilnID: 'woodrow1',
  controllerProgramID: '1',
  version: 1,
  type: 'bisque',
  name: 'Slow bisque',
  description: 'Good for large work, or small work that\'s not completely dry',
  steps: [
    {
      id: 1,
      endTemp: 200,
      rate: 50,
      hold: 0
    },
    {
      id: 2,
      endTemp: 520,
      rate: 100,
      hold: 0
    },
    {
      id: 3,
      endTemp: 600,
      rate: 80,
      hold: 0
    },
    {
      id: 4,
      endTemp: 1000,
      rate: 150,
      hold: 10
    }
  ],
  created: '2021-05-06T21:13:25+1000',
  createdBy: 'evanwills',
  superseded: false,
  deleted: false,
  locked: false,
  used: false,
  useCount: 0
}]

const updateField = (id, version, key, value, force) => (program, i, all) => {
  if (program.id === id &&
      program.version === version &&
      typeof program[key] === typeof val &&
      program[key] !== value
  ) {
    switch (key) {
      case 'description':
        return {
          ...program,
          description: value.trim()
        }
    }

    if (force === true) {
      switch (key) {
        case 'name':
          if (uniquePogramName(all, value, program.kilnID)) {
            return {
              ...program,
              name: value.trim()
            }
          } else {
            console.error('Could not update firing program name because "' + value + '" was not unique')
            break
          }

        case 'type':
          const tmp = validFiringType(value) // eslint-disable-line
          if (tmp !== false) {
            return {
              ...program,
              type: tmp
            }
          } else {
            console.error('Could not update firing program type because "' + value + '" was invalid')
            break
          }

        case 'kilnID':
          return {
            ...program,
            kilnID: value
          }

        case 'controllerProgramID':
          return {
            ...program,
            controllerProgramID: value
          }
      }
    }
  }

  return program
}

const updateProgramField = (allPrograms, payload) => {
  const id = (!invalidString('id', payload, true)) ? payload.id : false
  const version = (!invalidNum('version', payload, true)) ? payload.version : false
  const field = (!invalidString('field', payload, true)) ? payload.field : false
  const val = payload.value
  const force = (invalidBool('force', payload, true) === false)

  if (field === false) {
    throw Error('updateProgramField() expects payload to have a "field" property. None given.')
  }

  let isUsed = false
  let clonedProgram = null
  for (let a = 0; a < allPrograms.length; a += 1) {
    if (allPrograms[a].kilnID === payload.kilnID && allPrograms[a].id === id && allPrograms[a].version === version && allPrograms[a].used === true) {
      isUsed = true
      clonedProgram = allPrograms[a]
      break
    }
  }

  if (isUsed === false) {
    return allPrograms.map(updateField(id, field, val, force))
  } else {
    return [
      ...allPrograms,
      {
        ...clonedProgram,
        ...payload,
        version: clonedProgram.version + 1,
        used: false,
        superseded: false
      }
    ]
  }
}

/**
 * Update a program's `used` status (and the used count)
 *
 * This can only be triggered by middleware
 *
 * @param {array}  allPrograms List of all available programs
 * @param {string} kilnID      ID of the kiln the program applies to
 * @param {string} id          ID of the program to be updated
 * @param {number} version
 *
 * @returns {array}
 */
const updateUsed = (allPrograms, kilnID, id, version) => {
  return allPrograms.map(program => {
    if (program.kilnID === kilnID && program.id === id && program.version === version) {
      return {
        ...program,
        used: true,
        useCount: program.useCount + 1
      }
    } else {
      return program
    }
  })
}

/**
 * Update a program's `superseded` status
 *
 * This can only be triggered by middleware
 *
 * @param {array}  allPrograms List of all available programs
 * @param {string} kilnID      ID of the kiln the program applies to
 * @param {string} id          ID of the program to be updated
 * @param {number} version     The version number for the program
 *
 * @returns {array}
 */
const updateSuperseded = (allPrograms, kilnID, id, version) => {
  return allPrograms.map(program => {
    if (program.kilnID === kilnID && program.id === id && program.version === version) {
      return {
        ...program,
        superseded: true
      }
    } else {
      return program
    }
  })
}

const updateTmpField = (program, payload) => {
  // console.group('updateTmpField()')
  // console.log('payload:', payload)
  // console.log('payload.id:', payload.id)
  // console.log('payload.value:', payload.value)
  // console.log('program:', program)
  // console.log('typeof program[' + payload.id + ']:', typeof program[payload.id])
  // console.log('typeof payload.value:', typeof payload.value)
  // console.log('program:', program)
  const newProgram = { ...program }

  if (typeof program[payload.id] === typeof payload.value) {
    newProgram[payload.id] = payload.value
    const errors = {}
    if (typeof newProgram.errors[payload.id] !== 'undefined') {
      for (const prop in newProgram.errors) {
        if (prop !== payload.id) {
          errors[prop] = newProgram.errors[prop]
        }
      }
    }
    newProgram.errors = (errors.length > 0) ? errors : newProgram.errors
    newProgram.lastField = payload.id

    // console.log('newProgram:', newProgram)
    // console.groupEnd()
    return newProgram
  }

  // console.groupEnd()

  return program
}

const updateErrors = (state, payload) => {
  const tmpErrors = {}
  // console.group('updateErrors()')
  // // <this is {a|test}>\
  // console.log('program:', state)
  // console.log('payload:', payload)

  tmpErrors[payload.id] = payload.value

  // console.log('tmpErrors:', tmpErrors)
  // console.log('output:', output)
  // console.groupEnd()
  return {
    ...state,
    tmp: {
      ...state.tmp,
      errors: {
        ...state.tmp.errors,
        ...tmpErrors
      }
    }
  }
}

const updateTmpStep = (program, action) => {
  const a = action.payload.extra * 1

  // console.group('updateTmpStep()')
  // console.log('action:', action)
  // console.log('action.payload:', action)
  // console.log('action.payload.id:', action.payload.id)
  // console.log('action.payload.value:', action.payload.value)
  // console.log('program:', program)
  // console.log('action.payload.extra:', action.payload.extra)
  // console.log('program.steps:', program.steps)

  if (typeof program.steps[a] !== 'undefined') {
    const newSteps = [...program.steps]
    newSteps[a][action.payload.id] = action.payload.value
    // console.log('typeof program.steps[' + a + ']:', typeof program.steps[a])
    // console.log('typeof program.steps[' + a + '][' + action.payload.id + ']:', typeof program.steps[a][action.payload.id])
    // console.log('newSteps:', newSteps)
    // console.log('newSteps[' + action.payload.extra + ']:', newSteps[action.payload.extra])
    // console.log('newSteps[' + action.payload.extra + '][' + action.payload.id + ']:', newSteps[action.payload.extra][action.payload.id])
    return {
      ...program,
      steps: newSteps
    }
  } else if (program.steps.length === a) {
    const tmpStep = {
      endTemp: 0,
      rate: 0,
      hold: 0
    }
    tmpStep[action.payload.id] = action.payload.value
    return {
      ...program,
      steps: [...program.steps, tmpStep]
    }
  }

  // console.groupEnd()
  return program
}

/**
 * Commit a new or changed program to the list of all programs
 *
 * @param {array}  allPrograms List of all programs in the system
 * @param {object} newProgram  New (or updated) program to be stored
 * @param {object} action      Action object containing useful metadata
 *
 * @returns {array} Updated list of programs
 */
const commitProgram = (allPrograms, newProgram, action) => {
  const { errors, mode, confirmed, ...newP } = newProgram
  const keys = Object.keys(errors)
  let all = [...allPrograms]

  if (keys.length > 0) {
    throw Error('Cannot commit program with errors in configuration')
  }

  if (mode === programActions.ADD ||
    mode === programActions.CLONE ||
    (mode === programActions.UPDATE && newP.used === true)
  ) {
    newP.id = getID(action.now, action.user)
    newP.created = getISODateStr(action.now)
    newP.createdBy = action.user
  }

  if (mode === programActions.UPDATE) {
    if (newP.used === true) {
      // Mark the original version of the program as superseded
      all = all.map(program => {
        if (program.id === newP.id) {
          return {
            ...program,
            superseded: true,
            locked: false
          }
        } else {
          return program
        }
      })
      // bump the version mumber for this program up by 1
      newP.version += 1
      // Add the new version to the list
      all.push(newP)
    } else {
      // Replace the old (unused) version of the program
      // with the new one
      all = all.map(program => (program.id === newP.id) ? newP : program)
    }
  } else {
    // Add the new program
    all.push(newP)
  }
  return all
}

/**
 * Update inferred values for program
 *
 * @param {object} program
 *
 * @returns {object}
 */
const updateTmpInferred = (program) => {
  let maxTemp = 0
  let duration = 0
  let lastTemp = 0
  let changedM = false
  let changedD = false
  let newP = false
  // console.group('updateTmpInferred()')
  // console.log('program:', program)

  for (let a = 0; a < program.steps.length; a += 1) {
    if (program.steps[a].endTemp > 0) {
      if (program.steps[a].endTemp > maxTemp) {
        maxTemp = program.steps[a].endTemp
        changedM = true
      }

      if (program.steps[a].rate > 0) {
        const temp = (program.steps[a].endTemp > lastTemp)
          ? (program.steps[a].endTemp - lastTemp)
          : (lastTemp - program.steps[a].endTemp)

        duration += ((temp / program.steps[a].rate) * 3600)
        lastTemp = program.steps[a].endTemp
        changedD = true
      }
    }
  }
  const newProgram = { ...program }
  if (changedM) {
    newProgram.maxTemp = maxTemp
    newP = true
  }
  if (changedD) {
    newProgram.duration = round(duration)
    newP = true
  }
  if (newP) {
    newProgram.averageRate = round((maxTemp / (duration / 3600)), 1)
  }
  // console.log('changedM:', changedM)
  // console.log('changedD:', changedD)
  // console.log('newP:', newP)
  // console.log('newProgram:', program)
  // console.groupEnd()
  return (newP) ? newProgram : program
}

export const programReducer = (state = { all: [], tmp: {} }, action) => {
  // console.group('programReducer()')
  // console.log('action:', action)
  // console.groupEnd()
  switch (action.type) {
    case programActions.ADD:
      if (uniquePogramName(state, action.payload.name, action.payload.kilnID)) {
        return [...state, action.payload]
      } else {
        console.error('Program did not have a unique name')
        break
      }

    case programActions.TMP_SET:
      return { ...state, tmp: action.payload.value }

    case programActions.TMP_UPDATE_FIELD:
      return { ...state, tmp: updateTmpField(state.tmp, action.payload) }

    case programActions.TMP_COMMIT_INNER:
      return {
        ...state,
        all: commitProgram(state.all, state.tmp, action),
        tmp: {}
      }

    case programActions.TMP_UPDATE_STEP_INNER:
      return { ...state, tmp: updateTmpStep(state.tmp, action) }

    case programActions.TMP_UPDATE_STEP_INFERRED:
      return { ...state, tmp: updateTmpInferred(state.tmp) }

    case programActions.TMP_CLEAR_CONFIRMED:
      return state

    case programActions.TMP_CLEAR_CONFIRMED_CONFIRM:
      return state

    case programActions.TMP_CLEAR_CONFIRMED_CONFIRM_TRUE:
      return state

    case programActions.TMP_CLEAR_CONFIRMED_CONFIRM_FALSE:
      return state

    case programActions.UPDATE:
      return updateProgramField(state, action.payload)

    case programActions.USED:
      return updateUsed(state, action.payload)

    case programActions.SUPERSEDE:
      return updateSuperseded(state, action.payload)

    case programActions.TMP_UPDATE_FIELD_ERROR:
      return updateErrors(state, action.payload)

    default:
      return state
  }
}
