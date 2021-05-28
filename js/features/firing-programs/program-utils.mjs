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
    locked: false,
    errors: {}
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
    createdBy: username,
    errors: {},
    lastField: 'kilnID'
  }

  if (_clone === true) {
    newProgram.name = '{{' + dateStr + '}}' + newProgram.name
    newProgram.version = 0
  } else {
    newProgram.version += 1
  }

  return newProgram
}

export const getTmpProgram = (program, mode) => {
  return {
    ...program,
    confirmed: false,
    errors: {},
    lastField: 'kilnID',
    mode: mode
  }
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
  console.group('validateName()')

  if (pName.length > 64) {
    console.groupEnd()
    return 'Program name is too long. Must not exceed 64 characters'
  } else if (pName.match(/[^a-z0-9 \-[\](),.'":&+]/i) !== null) {
    console.groupEnd()
    return 'Program name contains invalid characters. Allowed characters: A-Z, a-z, 0-9, " ", "[", "]", "(", ")", ",", ".", "\'", \'"\', ":", "&", "+"'
  } else if (kilnID !== '') {
    const programName = kilnID + normalisedID(pName)
    for (let a = 0; a < allPrograms.length; a += 1) {
      if (allPrograms[a].superseded || allPrograms[a].deleted) {
        // We're only interested in active programs don't bother
        // with old or deleted programs
        continue
      }
      if (allPrograms[a].kilnID + normalisedID(allPrograms[a].name) === programName) {
        console.groupEnd()
        return 'Program name is not unique for specified kiln'
      }
    }
  }
  console.groupEnd()
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

/**
 * Get the latest version of a program
 *
 * @param {array}  allPrograms List of all available programs
 * @param {string} kilnID      ID for kiln assigned to program
 * @param {string} name        Name of the program
 *
 * @returns {object}
 */
export const getLastProgram = (allPrograms, kilnID, name) => {
  let a = allPrograms.length - 1
  const b = a
  for (a; a >= 0; a -= 1) {
    if (allPrograms[a].kilnID === kilnID && allPrograms[a].name === name) {
      return allPrograms[a]
    }
  }
  return allPrograms[b]
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
  const errorFields = Object.keys(errors)

  console.group('getFocusID()')
  console.log('editableFields:', editableFields)
  console.log('errorFields:', errorFields)
  console.log('lastID:', lastID)

  if (errorFields.length > 0) {
    console.log('Go to the first field in error')
    console.log('errorFields[0]:', errorFields[0])
    console.groupEnd()
    return errorFields[0]
  } else {
    const i = editableFields.indexOf(lastID)
    if (i > -1) {
      const b = (i + 1)
      if (b < editableFields.length) {
        console.log('Go to the next field')
        console.log('editableFields[' + b + ']:', editableFields[b])
        console.groupEnd()
        return editableFields[b]
      }
    }
  }
  console.groupEnd()
  return ''
}
