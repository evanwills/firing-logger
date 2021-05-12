
export const firingTypes = [
  'bisque',
  'glaze',
  'single',
  'luster',
  'onglaze',
  'raku'
]

const getNormalisedName = (name) => name.replace(/[^a-z0-9]+/ig, '').toLowerCase()

/**
 * Check whether a new program has a name that is unique for that
 * kiln
 *
 * @param {array}  programs   List of programs for all available
 *                            kilns
 * @param {object} newProgram New program for a specific kiln
 *
 * @returns {boolean} TRUE if the program's name is unique
 *                    FALSE otherwise
 */
export const uniquePogramName = (allPrograms, newName, kilnID) => {
  const _newName = getNormalisedName(newName)

  // if (newName.match(/^[a-z]+[0-9]*$/) === null) {
  //   return false
  // }

  const matching = allPrograms.filter(program => (
    program.kilnID === kilnID &&
    getNormalisedName(program.name) === _newName)
  )

  return (matching.length === 0)
}

export const validFiringType = (fType) => {
  const _fType = fType.toLowerCase()

  if (firingTypes.indexOf(_fType) > -1) {
    return _fType
  } else {
    return false
  }
}
