import { isBoolTrue, invalidNum } from '../../utilities/validation.mjs'
import { getISODateStr, normalisedID } from '../../utilities/sanitisation.mjs'
import {
  getMinMaxFilter,
  getBoolfilter,
  getStringMatchFilter,
  getFilterFunc
} from '../../utilities/filterGetters.mjs'

export const getNewProgram = () => {
  return {
    id: 0,
    kilnID: '',
    controllerProgramID: '',
    version: 0,
    type: '',
    name: '',
    description: '',
    maxTemp: 0,
    duration: 0,
    averageRate: 0,
    steps: [
      {
        id: 1,
        endTemp: 0,
        rate: 0,
        hold: 0
      }
    ],
    created: '',
    createdBy: '',
    superseded: false,
    used: false,
    useCount: 0,
    deleted: false,
    locked: false
  }
}

/**
 * Get a specific firing program object.
 *
 * @param {array}  allPrograms List of all programs available
 * @param {string} kilnID      ID of kiln program applies to
 * @param {string} name        Name of program
 * @param {number} version     Version of the program being updated
 *
 * @returns {object,false} The matching program or FALSE if no
 *                         matching program could be found
 */
export const getProgramByID = (allPrograms, id) => {
  const tmp = allPrograms.filter(program => (program.id === id))

  if (tmp.length === 1) {
    return tmp[0]
  } else {
    return false
  }
}

// /**
//  * Get a specific firing program object.
//  *
//  * @param {array}  allPrograms List of all programs available
//  * @param {string} kilnID      ID of kiln program applies to
//  * @param {string} name        Name of program
//  * @param {number} version     Version of the program being updated
//  *
//  * @returns {object,false} The matching program or FALSE if no
//  *                         matching program could be found
//  */
// export const getProgram = (allPrograms, kilnID, name, version) => {
//   const _name = getNormalisedName(name)
//   const tmp = allPrograms.filter(program => (program.kilnID === kilnID && getNormalisedName(program.name) === _name && program.version === version))

//   if (tmp.length === 1) {
//     return tmp[0]
//   } else {
//     return false
//   }
// }

/**
 *
 * @param {object}   program  Program object to be copied/updated
 * @param {bloolean} clone    Whether or not the object is to be
 *                            cloned as a new program or to receive
 *                            updates to the original
 * @param {string}   date     ISO8601 date formatted string
 * @param {string}   username User ID for the user doing the action
 * @returns
 */
export const cloneUpdateProgram = (program, clone, date, username) => {
  const _clone = isBoolTrue(clone)
  const dateStr = getISODateStr(date)

  const newProgram = {
    ...program,
    used: false,
    superseded: false,
    useCount: 0,
    created: dateStr,
    createdBy: username
  }

  if (_clone === true) {
    newProgram.name = '{{' + dateStr + '}}' + newProgram.name
    newProgram.version = 0
  } else {
    newProgram.version += 1
  }

  return newProgram
}

export const getFilteredPrograms = (filters) => {
  let pureFilters = []

  if (!invalidNum('controllerProgramID', filters) && (filters.controllerProgramID > -1)) {
    pureFilters.push((item) => item.controllerProgramID === filters.controllerProgramID)
  }

  pureFilters = getStringMatchFilter(pureFilters, filters, 'name')
  pureFilters = getStringMatchFilter(pureFilters, filters, 'createdBy', true)
  pureFilters = getStringMatchFilter(pureFilters, filters, 'type', true)
  pureFilters = getStringMatchFilter(pureFilters, filters, 'kilnID', true)

  pureFilters = getBoolfilter(pureFilters, filters, 'superseded')
  pureFilters = getBoolfilter(pureFilters, filters, 'used')

  pureFilters = getMinMaxFilter(pureFilters, filters, 'temp', 'maxTemp')
  pureFilters = getMinMaxFilter(pureFilters, filters, 'duration')
  pureFilters = getMinMaxFilter(pureFilters, filters, 'created')

  return getFilterFunc(pureFilters)
}

/**
 * Get the name of a kiln by ID
 *
 * @param {string} kilnID ID of the kiln to be named
 * @param {array}  kilns  List of all kilns available
 *
 * @returns {string}
 */
export const getKilnName = (kilnID, kilns) => {
  const rightKiln = kilns.filter(kiln => kiln.id === kilnID)

  return (rightKiln.length > 0) ? rightKiln[0].name : ''
}

const validateName = (pName, kilnID, allPrograms) => {
  if (kilnID !== '') {
    const programName = kilnID + normalisedID(pName) // eslint-disable-line
    for (let a = 0; a < allPrograms.length; a += 1) {
      if (allPrograms[a].superseded || allPrograms[a].deleted) {
        // We're only interested in active programs don't bother
        // with old or deleted programs
        continue
      }
      if (allPrograms[a].kilnID + normalisedID(allPrograms[a].name) === programName) {
        return 'Program name is not unique for specified kiln'
      }
    }
    if (pName.length > 64) {
      return 'Program name is too long. Must not exceed 64 characters'
    }
    if (pName.match(/[^a-z0-9 \-[\](),.'":&+]/i) !== null) {
      return 'Program name contains invalid characters. Allowed characters: A-Z, a-z, 0-9, " ", "[", "]", "(", ")", ",", ".", "\'", \'"\', ":", "&", "+"'
    }
  }
  return false
}

/**
 * Test whether a given value is valid for a given program property
 *
 * @param {object} action      Redux action object
 * @param {object} tmpProgram  Current program being edited
 * @param {array}  allPrograms List of all available programs
 * @param {array}  allKilns    List of all available kilns
 *
 * @returns {false,string} If field to be updated is valied then
 *                         FALSE is return otherwise a string error
 *                         message is returned
 */
export const isInvalidProgramField = (action, tmpProgram, allPrograms, allKilns) => {
  // let tmp = ''

  switch (action.payload.id) {
    case 'name':
      return validateName(action.payload.value, tmpProgram.kilnID, allPrograms)
  }
  return false
}
