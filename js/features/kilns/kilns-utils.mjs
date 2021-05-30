/**
 * This file contains a number of "pure" utitlity functions used for
 * doing discrete kiln related stasks
 */

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
