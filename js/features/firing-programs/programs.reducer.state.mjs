import { programActions } from './programs.actions.state.mjs'
import { uniquePogramName, validFiringType } from './programDataValidation.mjs'
import { invalidBool, invalidString, invalidNum, isBoolTrue } from '../../utilities/validation.mjs'
import { getISODateStr } from '../../utilities/sanitisation.mjs'

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

export const programReducer = (state = { all: [], tmp: {} }, action) => {
  switch (action.type) {
    case programActions.ADD:
      if (uniquePogramName(state, action.payload.name, action.payload.kilnID)) {
        return [...state, action.payload]
      } else {
        console.error('Program did not have a unique name')
        break
      }

    case programActions.UPDATE:
      return updateProgramField(state, action.payload)

    case programActions.USED:
      return updateUsed(state, action.payload)

    case programActions.SUPERSEDE:
      return updateSuperseded(state, action.payload)
  }
}
