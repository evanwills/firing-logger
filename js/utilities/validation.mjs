/**
 * This file contains two collections of validation functions:
 *   1. Simple type validation functions
 *   2. Object property type checkers
 *
 * The simple validation functions only test type of a single value.
 * It returns `TRUE` if the value passed validation or `FALSE`
 * otherwise.
 *
 * The complex validation functions (`invalid_[type]_()`) test
 * whether a property exists in an object then whether the property
 * is of the correct type. They return `FALSE` if the object's
 * property was _NOT_ invalid. If the value was invalid, it returns
 * a string naming the value's data type.
 * This makes super simple and efficient to test objects and report
 * on invalid property values.
 *
 * These functions were originally created for simpler
 * error reporting and thus return `FALSE` if the value is of the
 * correct type. If the type was incorrect, the data type is
 * returned so it can be used in an error message.
 */

const normalisedID = (input) => {
  const tmp = input.replace(/[^a-z0-9_-]/ig, '')
  return tmp.toLowerCase()
}

/**
 * Check whether something is a string
 *
 * @param {any} input Value that should be a string
 *
 * @returns {boolean} `TRUE` if the input is a string.
 *                    `FALSE` otherwise
 */
export const isStr = (input) => (typeof input === 'string')

/**
 * Test whether a value is a string and not empty (after being trimmed)
 *
 * e.g.
 *  * isNonEmptyStr('A') = TRUE
 *  * isNonEmptyStr('\nA, B, C\t') = TRUE
 *  * isNonEmptyStr('123456') = TRUE
 *  * isNonEmptyStr('0') = TRUE
 *  * isNonEmptyStr(12345) = FALSE
 *  * isNonEmptyStr(0) = FALSE
 *  * isNonEmptyStr(' ') = FALSE
 *  * isNonEmptyStr('\n\t') = FALSE
 *
 * @param {any} input Value that should be a non-empty string
 *
 * @returns {boolean} `TRUE` if the input is a non-empty string.
 *                    `FALSE` otherwise
 */
export const isNonEmptyStr = (input) => (isStr(input) && input.trim() !== '')

/**
 * Check whether something is a boolean
 *
 * @param {any} input value that shoudl be a boolean
 *
 * @returns {boolean} `TRUE` if the input is a boolean.
 *                    `FALSE` otherwise
 */
export const isBool = (input) => (typeof input === 'boolean')

/**
 * Test whether a value is boolean and TRUE
 *
 * e.g.
 *  * isBoolTrue(true) = TRUE
 *  * isBoolTrue(false) = FALSE
 *  * isBoolTrue() = FALSE
 *  * isBoolTrue(0) = FALSE
 *  * isBoolTrue(1) = FALSE
 *  * isBoolTrue('true') = FALSE
 *
 * @param {any} input value that should be boolean and _TRUE_
 *
 * @returns {boolean} `TRUE` if the input is a boolean and `TRUE`.
 *                    `FALSE` otherwise
 */
export const isBoolTrue = (input) => (typeof input === 'boolean' && input === true)

/**
 * Test whether a value is boolean and FALSE
 *
 * e.g.
 *  * isBoolTrue(false) = TRUE
 *  * isBoolTrue(true) = FALSE
 *  * isBoolTrue() = FALSE
 *  * isBoolTrue(0) = FALSE
 *  * isBoolTrue(1) = FALSE
 *  * isBoolTrue('true') = FALSE
 *
 * @param {any} input value that shoudl be a boolean
 *
 * @returns {boolean} `TRUE` if the input is a boolean and `FALSE`.
 *                    `FALSE` otherwise
 */
export const isBoolFalse = (input) => (typeof input === 'boolean' && input === false)

/**
 * Check whether something is a number
 *
 * @param {any} input Value that should be a number
 *
 * @returns {boolean} `TRUE` if the input is a number.
 *                    `FALSE` otherwise
 */
export const isNumber = (input) => {
  return (typeof input === 'number' && !isNaN(parseFloat(input)))
  // return (typeof input === 'number' && !isNaN(parseFloat(input)) && !isFinite(input))
}

/**
 * Check whether something is a Function
 *
 * @param {any} input Value that should be numeric
 *
 * @returns {boolean} `TRUE` if the input is a Function.
*                    `FALSE` otherwise
 */
export const isNumeric = (input) => {
  if (isNumber(input)) {
    return true
  } else if (isStr(input)) {
    return isNumber(input * 1)
  } else {
    return false
  }
}

/**
 * Check whether something is either a string or number
 *
 * @param {any} input Value that should be numeric
 *
 * @returns {boolean} `TRUE` if the input is either a string or number
 *                    `FALSE` otherwise
 */
export const isStrNum = (input) => (isNumeric(input) || isStr(input))

/**
 * Check whether something is an integer
 *
 * @param {any} input Value that should be numeric
 *
 * @returns {boolean} `TRUE` if the input is an integer
 *                    `FALSE` otherwise
 */
export const isInt = (input) => (isNumeric(input) && !isNaN(parseInt(input)))

/**
 * Check whether something is an integer
 *
 * @param {any} input Value that should be numeric
 *
 * @returns {boolean} `TRUE` if the input is an integer greater than
 *                    zero. `FALSE` Otherwise
 */
export const isPosInt = (input) => (isInt(input) && input > 0)

/**
 * Check whether something is a valid date string or a Date object
 * @param {any} input Value that should be a date object or a date
 *                    string
 *
 * @returns {boolean} True if the value is a valid date string or
 *                    an actual Date object
 */
export const isDate = (input) => {
  const dType = typeof input

  if (dType === 'string') {
    return !isNaN(Date.parse(input))
  } else if (dType === 'object') {
    return (Object.prototype.toString.call(input) === '[object Date]')
  } else {
    return false
  }
}

/**
 * Check whether something is a string, boolean or number
 *
 * The definition "Scalar" this function uses is based on the PHP
 * function of the same name (`is_scalar()`).
 * This definitition may conflict with some definitions of scalar
 * where strings, and/or booleans are excluded or where `null` _is_
 * included.
 * (see: https://www.php.net/manual/en/function.is-scalar.php)
 *
 * @param {any} input Value that should be a scalar
 *
 * @returns {boolean} `TRUE` if the input is a scalar value.
 *                    `FALSE` otherwise
 */
export const isScalar = (input) => {
  const _type = typeof input
  return (_type === 'string' || _type === 'boolean' || _type === 'number')
}

/**
 * Check whether something is a Function
 *
 * @param {any} functionToCheck function
 *
 * @returns {boolean} `TRUE` if the input is a Function.
 *                    `FALSE` otherwise
 */
export const isFunction = (functionToCheck) => {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

/**
 * Check whether something is an object
 * @param {any} input
 * @returns
 */
export const isObject = (input, notEmpty) => {
  const _notE = isBoolTrue(notEmpty)

  return (typeof input === 'object' && input !== null &&
          (_notE === false || (Object.keys(input).length > 0)))
}

/**
 * Test whether a variable is iterable
 *
 * @param {any} value to be tested
 *
 * @return {boolean} `TRUE` if input is an array or iterable object
 *                   `FALSE` otherwise
 */
export const isIterable = (input) => {
  // checks for null and undefined
  if (input == null) {
    return false
  }
  return (typeof input[Symbol.iterator] === 'function' || typeof input.propertyIsEnumerable === 'function')
}

/**
 * Test whether input is a lit-html or lit-svg output function
 *
 * @param {any} value to be tested
 *
 * @return {boolean} `TRUE` if input is a lit-html or lit-svg output function
 *                   `FALSE` otherwise
 */
export const isLit = (input) => {
  // console.group('islit()')
  // console.groupEnd()
  return (typeof input !== 'undefined' && typeof input.type === 'string' && (input.type === 'html' || input.type === 'svg'))
}

export const isLitOrStr = (input) => {
  return (isStr(input) || isLit(input))
}

export const validateSafeStr = (input, prop, alls) => {
  if (!isStr(input)) {
    throw Error(' is not a string.')
  } else if (input.length > 64) {
    console.groupEnd()
    throw Error(' is too long. Must not exceed 64 characters')
  } else if (input.match(/[^a-z0-9 \-[\](),.'":&+]/i) !== null) {
    console.groupEnd()
    throw Error(' contains invalid characters. Allowed characters: A-Z, a-z, 0-9, " ", "[", "]", "(", ")", ",", ".", "\'", \'"\', ":", "&", "+"')
  }
  return true
}

export const isSafeStr = (input) => {
  return (validateSafeStr(input) === true)
}

/**
 * Test whether a name is valid and unique
 *
 * @param {string}  name Value to be convert to URL part
 * @param {string}  prop Name of value
 * @param {array}   alls List of all items that could have the same
 *                       name
 *
 * @returns {string} URL save version of name
 */
export const validateUnique = (input, prop, alls) => {
  const _prop = (isStr(prop)) ? prop : ''
  const _ok = validateSafeStr(input)
  const _norm = normalisedID(input)

  if (_ok !== true) {
    throw Error(_prop + _ok)
  } else if (_prop !== '' && Array.isArray(alls)) {
    for (let a = 0; a < alls.length; a += 1) {
      if (!invalidString(_prop, alls[a]) &&
          normalisedID(alls[a][prop]) === _norm
      ) {
        throw Error(_prop + ' is not unique')
      }
    }
  }
  return true
}

// ========================================================

/**
 * Test whether an object contains a given property and the value
 * of that property is a string
 *
 * @param {string} prop  name of the property to be tested
 * @param {object} input object that might contain the property of
 *                       the correct type
 * @param {boolean} notEmpty
 *
 * @returns {false,string} If the value is a string then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting erros).
 */
export const invalidString = (prop, input, notEmpty) => {
  let tmp = ''

  if (!isStr(prop)) {
    throw new Error('invalidString() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (!isObject(input)) {
    throw new Error('invalidString() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  tmp = typeof input[prop]
  if (tmp !== 'string') {
    return tmp
  } else if (isBoolTrue(notEmpty) === true && input[prop].trim() === '') {
    return 'empty string'
  } else {
    return false
  }
}

export const invalidStr = invalidString

/**
 * Test whether an object contains a given property and the value
 * of that property is either a string or a number
 *
 * @param {string} prop  name of the property to be tested
 * @param {object} input object that might contain the property of
 *                       the correct type
 *
 * @returns {false,string} If the value is a string or number then
 *                         it is NOT invalid. Otherwise the value's
 *                         data type returned (so it can be used when
 *                         reporting errors).
 */
export const invalidStrNum = (prop, input) => {
  let tmp = ''

  if (typeof prop !== 'string') {
    throw new Error('invalidStrNum() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop +
    ' given.')
  }
  if (typeof input !== 'object') {
    throw new Error('invalidStrNum() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  tmp = typeof input[prop]
  if (tmp !== 'string' && tmp !== 'number') {
    return tmp
  } else {
    return false
  }
}

/**
 * Test whether an object contains a given property and the value
 * of that property is a number
 *
 * @param {string} prop  name of the property to be tested
 * @param {object} input object that might contain the property of
 *                       the correct type
 *
 * @returns {false,string} If the value is a number then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting errors).
 */
export const invalidNum = (prop, input) => {
  let tmp = ''

  if (typeof prop !== 'string') {
    throw new Error('invalidNum() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (!isObject(input)) {
    throw new Error('invalidNum() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  tmp = typeof input[prop]
  if (tmp === 'undefined') {
    return tmp
  } else if (!isNumber(input[prop])) {
    return tmp + ' (is not a number)'
  } else {
    return false
  }
}

/**
 * Test whether an object contains a given property and the value
 * of that property is an array
 *
 * @param {string}  prop     name of the property to be tested
 * @param {object}  input    object that might contain the property
 *                           of the correct type
 * @param {boolean} notEmpty whether or not the array must be
 *                           not-empty If TRUE and the array is empty
 *                           'empty array' will be returned instead
 *                           of false
 *
 * @returns {false,string} If the value is an array then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting errors).
 */
export const invalidArray = (prop, input, notEmpty) => {
  const _notEmpty = (isBool(notEmpty) && notEmpty === true)
  if (typeof prop !== 'string') {
    throw new Error('invalidArray() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (!isObject(input)) {
    throw new Error('invalidArray() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  if (!Array.isArray(input[prop])) {
    return typeof input[prop] + ' (not Array)'
  } else if (_notEmpty && input[prop].length === 0) {
    return 'empty array'
  } else {
    return false
  }
}

/**
 * Test whether an object contains a given property and the value
 * of that property is a boolean
 *
 * @param {string}  prop      name of the property to be tested
 * @param {object}  input     object that might contain the property
 *                            of the correct type
 * @param {boolean} trueFalse (optional) If `TRUE`, object property
 *                            must be _BOTH_ `boolean` _AND_ `TRUE`.
 *                            If `FALSE`, it must be _BOTH_ `boolean`
 *                            _AND_ `FALSE`
 *
 * @returns {false,string} If the value is a boolean then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting errors).
 */
export const invalidBool = (prop, input, trueFalse) => {
  if (typeof prop !== 'string') {
    throw new Error('invalidBool() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (!isObject(input)) {
    throw new Error('invalidBool() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }
  const _trueFalse = (isBool(trueFalse)) ? trueFalse : null

  const _type = typeof input[prop]
  if (_type === 'boolean') {
    if (_trueFalse === null || input[prop] === trueFalse) {
      return false
    } else {
      const tfStr = (trueFalse) ? 'TRUE' : 'FALSE'
      return 'Not ' + tfStr
    }
  } else {
    return _type
  }
}

/**
 * Test whether an object contains a given property and the value
 * of that property is a scalar value (string, number or boolean)
 *
 * @param {string} prop  name of the property to be tested
 * @param {object} input object that might contain the property of
 *                       the correct type
 *
 * @returns {false,string} If the value is a scalar then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting errors).
 */
export const invalidScalar = (prop, input) => {
  if (typeof prop !== 'string') {
    throw new Error('invalidScalar() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (!isObject(input)) {
    throw new Error('invalidScalar() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  const _type = typeof input[prop]
  return (_type === 'boolean' && _type !== 'string' && _type !== 'number') ? _type : false
}

/**
 * Test whether an object contains a given property and the value
 * of that property is a lit-html object or string
 *
 * @param {string} prop  name of the property to be tested
 * @param {object} input object that might contain the property of
 *                       the correct type
 *
 * @returns {false,string} If the value is a lit-html object or an
 *                         string, then it is NOT invalid.
 *                         Otherwise the value's data type returned
 *                         (so it can be used when reporting errors).
 */
export const invalidLit = (prop, input) => {
  if (typeof prop !== 'string') {
    throw new Error('invalidLit() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (!isObject(input)) {
    throw new Error('invalidLit() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  const _type = typeof input[prop]
  return (_type === 'undefined' || !isLitOrStr(input[prop])) ? _type : false
}

/**
 * Test whether an object contains a given property and the value
 * of that property is another object
 *
 * @param {string} prop  name of the property to be tested
 * @param {object} input object that might contain the property of
 *                       the correct type
 *
 * @returns {false,string} If the value is an objet then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting errors).
 */
export const invalidObject = (prop, input, notEmpty) => {
  if (typeof prop !== 'string') {
    throw new Error('invalidScalar() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (!isObject(input)) {
    throw new Error('invalidScalar() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  const _type = typeof input[prop]

  // console.group('invalidObject()')
  // console.log('prop:', prop)
  // console.log('input:', input)
  // console.log('_type:', _type)
  // console.log('_type !== "undefined":', _type !== 'undefined')
  // console.log('isObject(input[prop], notEmpty):', isObject(input[prop], notEmpty))
  // console.groupEnd()

  return (_type !== 'undefined' && isObject(input[prop], notEmpty)) ? false : _type
}
