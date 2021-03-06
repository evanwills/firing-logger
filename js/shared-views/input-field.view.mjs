import { html } from '../vendor/lit-html/lit-html.mjs'
import { ifDefined } from '../vendor/lit-html/directives/if-defined.mjs'
import {
  isBool,
  isBoolTrue,
  // isFunction,
  // isInt,
  isLit,
  isNonEmptyStr,
  isNumber,
  // isNumeric,
  isStr,
  isStrNum,
  invalidBool,
  invalidObject,
  invalidString
} from '../utilities/validation.mjs'
import {
  getClassName,
  idSafe,
  // makeHTMLsafe,
  ucFirst
} from '../utilities/sanitisation.mjs'
import { getItemList } from '../features/item-list/item-list.view.mjs'
import { invalidLit } from '../utilities/validation.mjs'

// /**
//  * Get the attribute string for an HTML input/select/textarea field
//  *
//  * @param {string} attr   Key in props object
//  *                        (and HTML attribute name)
//  * @param {object} props  Object to get attribute values from
//  * @param {string} prefix Prefix for object property name to allow
//  *                        for the component to have multiple elements
//  *                        with different values for the same
//  *                        attribute name
//  *
//  * @returns {string} HTML attribute with value or empty string
//  */
// export const getAttr = (attr, props, prefix) => {
//   const _attr = (typeof prefix === 'string')
//     ? prefix.trim() + ucFirst(attr.trim())
//     : attr

//   return (isNumber(props[_attr]) || isNonEmptyStr(props[_attr]))
//     ? ' ' + attr.toLowerCase() + '="' + props[_attr] + '"'
//     : ''
// }

/**
 * Get the bolean attribute string for an HTML input/select/textarea
 * field
 *
 * @param {string}  attr    Key in props object
 *                          (and HTML attribute name)
 * @param {object}  props   Object to get attribute values from
 * @param {boolean} reverse Reverse the value of the output
 *                          (TRUE returns FALSE)
 *
 * @returns {boolean} HTML attribute with value or empty string
 */
export const getBoolAttr = (attr, props, reverse) => {
  // console.group('getBoolAttr()')
  // console.log('attr:', attr)
  // console.log('props:', props)
  // console.log('reverse:', reverse)
  const output = !invalidBool(attr, props, true)
  // console.log('output:', output)
  // console.log('(isBoolTrue(reverse)) ? !output : output:', (isBoolTrue(reverse)) ? !output : output)
  // console.groupEnd()
  return (isBoolTrue(reverse)) ? !output : output
}

export const getPreSuf = (props, className, isSuffix) => {
  const _end = (isBoolTrue(isSuffix)) ? 'suffix' : 'prefix'

  if (typeof props[_end] !== 'undefined' && (isNonEmptyStr(props[_end]) || isLit(props[_end]))) {
    return isStr(className)
      ? html`<span class="input-field__input__${_end}">${props[_end]}</span>`
      : props[_end]
  }
  return ''
}

export const wrapPreSuf = (field, props, className) => {
  if (!invalidObject('prefix', props) || !invalidString('prefix', props) ||
          !invalidObject('suffix', props) || !invalidString('suffix', props)
  ) {
    const pre = getPreSuf(props, className, false)
    const post = getPreSuf(props, className, true)

    return html`<span class="input-field__input-wrap ${(pre === '') ? '' : 'input-field__input-wrap--left'}">${pre}${field}${post}</span>`
  } else {
    return field
  }
}

/**
 * Get an HTML Label element for an input/textarea/select field
 *
 * @param {object} props List of input field properties
 *
 * @returns {lit-html}
 */
export const getLabel = (props) => {
  return html`<label for="${props.id}" class="${getClassName(props, 'label')}">
    ${props.label}
  </label>`
}

/**
 * Get a single datalist option element
 *
 * @param {string,object} input Value of data option
 *                              If value is a string then it is
 *                              simply used as the value of the
 *                              option
 *                              If the value is an object with with
 *                              a value property, then the value
 *                              prop is used as the option value.
 *                              If the object also has a default
 *                              property, then the option is set to
 *                              selected.
 *
 * @returns {lit-html}
 */
export const dataOption = (input) => {
  const _type = typeof input.option
  if (_type === 'object') {
    const _selected = (isBoolTrue(input.default))
    return html`<option value="${input.value}" ?selected=${_selected}>`
  } else if (isStrNum(_type)) {
    return html`<option value="${input}">`
  } else {
    throw Error('dataOption() expects input to be either a string, a number or an object with a "value" property (and optionally a "default" property). ' + _type + ' given!')
  }
}

/**
 * Get a datalist element for predefined text field options
 *
 * @param {string} id      ID of the parent element
 * @param {array}  options List of data list options
 *
 * @returns {lit-html}
 */
export const dataList = (id, options) => {
  if (typeof options !== 'undefined' && Array.isArray(options) && options.length > 0) {
    return html`
      <datalist id="${id}-options">
        ${options.map(dataOption)}
      </datalist>
    `
  } else {
    return ''
  }
}

/**
 * Get a "list" attribute for text input
 *
 * @param {object} props Input field properties.
 *
 * @returns {string}
 */
export const getListAttr = (props) => {
  if (typeof props.options !== 'undefined' && Array.isArray(props.options) && props.options.length > 0) {
    return ' list="' + props.id + '-options"'
  } else {
    return ''
  }
}

/**
 * Get a "list" attribute for text input
 *
 * @param {object} props Input field properties.
 *
 * @returns {string}
 */
export const getDescbyAttr = (props) => {
  return (isNonEmptyStr(props.desc))
    ? props.id + '-describe'
    : undefined
}

/**
 * Get a description block for a input field.
 *
 * @param {object} props All the properties of the parent element
 *
 * @returns {lit-html}
 */
export const describedBy = (props) => {
  return (isNonEmptyStr(props.desc))
    ? html`<div id="${props.id}-describe" class="${getClassName(props, 'desc')}">${props.desc}</div>`
    : ''
}

/**
 * Get a string to be used as an HTML attribute value
 *
 * @param {any} input Value to be returned (hopefully) String or
 *                    number
 * @param {string, undefined} defaultStr default string if input is
 *                   not valid
 *
 * @returns {string} String to be used as an HTML attribute value
 */
const propOrUn = (input, defaultStr) => {
  return (isStrNum(input))
    ? input
    : isStrNum(defaultStr)
      ? defaultStr
      : undefined
}

export const nonInputField = (props) => {
  const _className = getClassName(props, 'input')
  console.group('nonInputField()')
  console.log('props', props)
  console.log('props.prefix', props.prefix)
  console.log('props.suffix', props.suffix)
  console.groupEnd()
  return html`
  <span class="${getClassName(props, 'label')}">${props.label}</span>
  <span class="${_className}--">${!invalidLit('prefix', props) ? props.prefix : ''} ${props.value} ${!invalidLit('suffix', props) ? props.suffix : ''}</span>`
}

/**
 * Get an text input field (with label)
 *
 * @param {object}  props     All the properties required for an
 *                            input field
 * @param {boolean} multiLine Whether or not input needs to be
 *                            textarea
 *
 * @return {lit-html}
 */
export const textInputField = (props, multiLine) => {
  // const txtProps = getAttrs(
  //   ['pattern', 'placeholder', 'list', 'maxlength', 'minlength', 'size'],
  //   props
  // )

  const _listAttr = getListAttr(props)
  const _descBy = getDescbyAttr(props)

  const _place = propOrUn(props.placeholder, props.label)
  const _pattern = propOrUn(props.pattern)
  const _maxLen = propOrUn(props.maxlength)
  const _minLen = propOrUn(props.minlength)
  const _disabled = getBoolAttr('disabled', props)
  const _required = getBoolAttr('required', props)
  const _read = getBoolAttr('readonly', props)
  const _focus = getBoolAttr('focus', props) //  ?autofocus=${_focus}
  const _multi = isBoolTrue(multiLine)
  const _multiClass = (_multi) ? 'multi-line' : ''
  const _className = getClassName(props, 'input', _multiClass)

  // console.group('textInputField()')
  // console.log('props:', props)
  // console.log('props.pattern:', props.pattern, (typeof props.pattern === 'undefined'))
  // console.log('props.placeholder:', props.placeholder, (typeof props.placeholder === 'undefined'))
  // console.log('props.maxLength:', props.maxLength, (typeof props.maxLength === 'undefined'))
  // console.log('props.minLength:', props.minLength, (typeof props.minLength === 'undefined'))
  // console.log('props.value:', props.value)
  // console.log('_descBy:', _descBy, (typeof _descBy === 'undefined'))
  // console.log('multiLine:', multiLine)
  // console.groupEnd()

  if (_multi) {
    return html`
      ${getLabel(props)}
      <textarea id="${props.id}" class="${_className}" @change=${props.change} ?required=${_required} ?readonly=${_read} ?disabled=${_disabled} pattern="${ifDefined(_pattern)}" placeholder="${ifDefined(_place)}" maxlength="${ifDefined(_maxLen)}" minlength="${ifDefined(_minLen)}" aria-describedby="${ifDefined(_descBy)}" .value="${props.value}" ?autofocus=${_focus}></textarea>
      ${(_descBy !== '') ? describedBy(props) : ''}
    `
  } else {
    return html`
      ${getLabel(props)}
      ${wrapPreSuf(
        html`<input type="text" id="${props.id}" class="${_className}" .value=${props.value} @change=${props.change} ?required=${getBoolAttr('required', props)} ?readonly=${_read} ?disabled=${_disabled} pattern="${ifDefined(_pattern)}" placeholder="${ifDefined(_place)}" maxlength="${ifDefined(_maxLen)}" minlength="${ifDefined(_minLen)}" aria-describedby="${ifDefined(_descBy)}" ?autofocus=${_focus} />`,
        props,
        _className
      )}
      ${(_listAttr !== '') ? dataList(props.id, props.options) : ''}
      ${(_descBy !== '') ? describedBy(props) : ''}
    `
  }
}

/**
 * Get an number input field (with label)
 *
 * @param {object}  props     All the properties required for an
 *                            input field
 *
 * @return {lit-html}
 */
export const numberInputField = (props) => {
  const _descBy = getDescbyAttr(props)
  const _focus = getBoolAttr('focus', props)
  const _className = getClassName(props, 'input', 'number')

  // console.group('numberInputField()')
  // console.log('props:', props)
  // console.log('!invalidString("suffix", props):', !invalidString('suffix', props))
  // console.log('props["suffix"]:', props.suffix)
  // console.log('props:', props)
  // console.groupEnd()

  return html`
    ${getLabel(props)}
    ${wrapPreSuf(
      html`<input type="number" id="${props.id}" .value=${props.value} class="${_className}" @change=${props.change} ?required=${getBoolAttr('required', props)} ?readonly=${getBoolAttr('readonly', props)} ?disabled=${getBoolAttr('disabled', props)} pattern="${ifDefined(propOrUn(props.pattern))}" placeholder="${ifDefined(propOrUn(props.placeholder))}" min="${ifDefined(propOrUn(props.min))}" max="${ifDefined(propOrUn(props.max))}" step="${ifDefined(propOrUn(props.step))}" aria-describedby="${ifDefined(_descBy)}" ?autofocus=${_focus} />`,
      props,
      _className
    )}
    ${(_descBy !== '') ? describedBy(props) : ''}
  `
}

export const colourInput = (props) => {
  const _descBy = getDescbyAttr(props)
  const _error = !invalidBool('error', props, true) ? ' has-error' : '' // ${_error}
  const _focus = getBoolAttr('focus', props)

  return html`
    <li class="input-pair">
      <label for="set-customMode-${props.id}" class="input-pair__label${_error}">Custom mode ${props.label} colour:</label>
      <input type="color" id="set-customMode-${props.id}" class="input-pair__input${_error}" value="${props.value}" tabindex="${props.tabIndex}" @change=${props.eventHandler} ?required=${getBoolAttr('required', props)} ?readonly=${getBoolAttr('readonly', props)} ?disabled=${getBoolAttr('disabled', props)} aria-describedby="${ifDefined(_descBy)}" ?autofocus=${_focus} /><!--
      --><span class="input-pair__suffix" style="background-color: ${props.value};">&nbsp;</span>
      ${(_descBy !== '') ? describedBy(props) : ''}
    </li>
  `
}

/**
 * Get a single SELECT field option
 *
 * @param {string,object} props Value of select option
 *                              If value is a string then it is
 *                              simply used as the value and the
 *                              label of the option
 *                              If the value is an object with with
 *                              a value property, then the value
 *                              prop is used as the option value.
 *                              If the object also has a default
 *                              property, then the option is set to
 *                              selected.
 *
 * @return {lit-html}
 */
const selectOption = (props) => {
  // console.group('selectOption()')
  // console.log('props:', props)

  const _selected = isBool(props.selected)
    ? props.selected
    : isBoolTrue(props.default)

  const _value = (isStr(props))
    ? props
    : props.value

  let _label = (isStrNum(props))
    ? props
    : (isNonEmptyStr(props.label))
        ? props.label
        : props.value

  _label = isStr(_label) ? _label.trim() : _label

  // console.log('_value:', _value)
  // console.log('_label:', _label)
  // console.log('_selected:', _selected)
  // console.groupEnd()

  return html`<option value=${_value} ?selected=${_selected}>${_label}</option>`
}

/**
 * Get a whole SELECT field with label (and optional described by block)
 *
 * @param {object} props All the properties required for an input
 *                       field
 *
 * @return {lit-html}
 */
export const selectField = (props) => {
  const _descBy = getDescbyAttr(props)

  const _error = !invalidBool('error', props, true) ? ' has-error' : '' //
  const _focus = getBoolAttr('focus', props) //

  // console.group('selectField()')
  // console.log('props:', props)
  // console.groupEnd()
  return html`
    ${getLabel(props)}
    <select id=${props.id} class="${getClassName(props, 'select')}${_error}" ?required=${getBoolAttr('required', props)} ?readonly=${getBoolAttr('readonly', props)} ?disabled=${getBoolAttr('disabled', props)} @change=${props.change} aria-describedby="${ifDefined(_descBy)}" ?autofocus=${_focus} />
      ${props.options.map(selectOption)}
    </select>
    ${(_descBy !== '') ? describedBy(props) : ''}
  `
}

/**
 * Get a single radio or checkbox input field
 *
 * @param {object} props     All the properties required for an
 *                           input field
 * @param {string} fieldType Whether the field is a "radio" or a
 *                           "checkbox" field
 * @param {string} descBy    Whole aria-describedby attribute string
 */
const checkableInput = (props, fieldType, descBy) => {
  const _name = (fieldType === 'radio') ? ' name="' + props.id + '"' : ''
  const _id = (fieldType === 'checkbox')
    ? props.id + '-' + idSafe(props.value)
    : props.id
  const _focus = getBoolAttr('focus', props) //

  return html`
    <input type=${fieldType}
          id=${_id}
          ${_name}
          value=${props.value}
          class=${getClassName(props, 'checkable')}
          ?checked=${props.checked}
          ?required=${getBoolAttr('required', props)}
          ?readonly=${getBoolAttr('readonly', props)}
          ?disabled=${getBoolAttr('disabled', props)}
          aria-describedby="${ifDefined(descBy)}"
          @change=${props.change}
          ?autofocus=${_focus} />`
}

/**
 * Get a whole (labeled) checkbox/radio intut field
 *
 * @param {object} props    All the properties required for an
 *                          input field
 * @param {boolean} outside Whether or not the label should wrap
 *                          the input field or be a separate element
 *                          following the input field
 *
 * @return {lit-html}
 */
export const wholeSingleCheckable = (props, outside) => {
  const _fieldType = (typeof props.type === 'string' && props.type === 'checkbox') ? 'checkbox' : 'radio'
  const _descBy = getDescbyAttr(props)
  const _desription = (_descBy !== '') ? describedBy(props) : ''
  const _inputField = checkableInput(props, _fieldType, _descBy)

  if (typeof outside === 'boolean' && outside === true) {
    return html`
      ${_inputField}
      ${getLabel(props)}
      ${_desription}
    `
  } else {
    return html`
      <label class="${getClassName(props, 'label')}">
        ${_inputField}
        ${props.label}
      </label>
      ${_desription}
    `
  }
}

export const checkableInputGroup = (props, outside) => {
  const _fieldType = (typeof props.type === 'string' && props.type === 'checkbox') ? 'checkbox' : 'radio'

  const _role = (_fieldType === 'radio') ? 'radiogroup' : 'group'
  const _outside = (typeof props.wrapped === 'boolean' && props.wrapped === true)

  return html`
    <div role="${_role}" aria-labelledby="${props.id}-grp-lbl" class=${getClassName(props, 'grp')}>
      <p class=${getClassName(props, 'grp-lbl')} id="${props.id}-grp-lbl">
        ${props.label}
      </p>
      <ul class=${getClassName(props, 'grp-list')}>
        ${props.options.map((option) => wholeSingleCheckable(
          {
            ...option,
            type: _fieldType,
            id: option.id + '-input',
            class: props.class,
            change: (typeof option.change === 'function')
              ? option.change
              : (typeof props.change === 'function')
                ? props.change
                : null
          },
          _outside
        ))}
      </ul>
    </div>
  `
}

export const fieldGroup = (props, ) => {
  return html`
    <p class="input-field__label" id="${props.id}-grp-lbl">
      ${props.label}
    </p>

    <div role="group" aria-labelledby="${props.id}-grp-lbl" class=${getClassName(props, 'grp')}>
      <ul class="item-list input-fields__list">

        ${getItemList(props.fields, '', 'input-fields')}
      </ul>
    </div>
  `
}
