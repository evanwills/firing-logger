import { programActions } from './programs.actions.state.js'
import { uniquePogramName } from './programDataValidation.mjs'
import { invalidBool, invalidString } from '../../utilities/validation.js'
import { validFiringType } from './programDataValidation.js'

export const initialPrograms = [{
  id: 1,
  kilnID: 'woodrow1',
  controllerProgramID: '1',
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
  createdBy: 'evanwills'
}]

const updateField = (id, key, value, force) => (program, i, all) => {
  if (program.id === id && typeof program[key] === typeof val && program[key] !== value) {
    if (key === 'description') {
      return {
        ...program,
        description: value.trim()
      }
    } else if (force === true) {
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
  const field = (!invalidString('field', payload, true)) ? payload.field : false
  const val = payload.value
  const force = (invalidBool('force', payload, true) === false)

  if (field === false) {
    throw Error('updateProgramField() expects payload to have a "field" property. None given.')
  }

  return allPrograms.map(updateField(id, field, val, force))
}

export const programReducer = (state = [], action) => {
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
  }
}
