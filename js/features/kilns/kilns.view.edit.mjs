import {
  // nonInputField,
  numberInputField,
  selectField,
  textInputField
} from '../../shared-views/input-field.view.mjs'
import { html } from '../../vendor/lit-html/lit-html.mjs'
import { getMainContent } from '../main-content/main-content.view.mjs'
import { kilnActions } from './kilns.state.actions.mjs'
import { getItemList } from '../item-list/item-list.view.mjs'
// import {
//   ucFirst,
//   auDateStr,
//   boolYesNo,
//   getHourMinSec,
//   getHHMMSS,
//   roundMinutes
//   getDeg,
//   getRate
// } from '../../utilities/sanitisation.mjs'
// import { getFiringLogSVG } from '../svg/svg.mjs'
import {
  // invalidBool,
  invalidString,
  invalidObject
} from '../../utilities/validation.mjs'
// import { getNavBar } from '../nav-bar/nav-bar.view.mjs'
import { getFocusID } from './kiln-utils.mjs'
import { getNavBar } from '../nav-bar/nav-bar.view.mjs'
import { checkboxBtnGroup } from '../../shared-views/checkbox.view.mjs'

const firingTypes = [{
  label: 'Bisque',
  value: 'bisque'
}, {
  label: 'Black firing',
  value: 'black'
}, {
  label: 'Glaze',
  value: 'glaze'
}, {
  label: 'Luster',
  value: 'luster'
}, {
  label: 'Onglaze',
  value: 'onglaze'
}, {
  label: 'Pit firing',
  value: 'pit'
}, {
  label: 'Raku',
  value: 'raku'
}, {
  label: 'Raw glaze',
  value: 'rawGlaze'
}, {
  label: 'Saggar',
  value: 'saggar'
}, {
  label: 'Salt glaze',
  value: 'saltGlaze'
}]

// const fuelToOptions = (id) => (kiln) => {
//   return {
//     value: kiln.id,
//     label: kiln.name,
//     selected: (kiln.id === id)
//   }
// }

const getErrorMsg = (errors) => {
  const keys = Object.keys(errors)
  const s = (keys.length > 1) ? 's' : ''
  const are = (keys.length > 1) ? 'are' : 'is'
  if (keys.length > 0) {
    return html`
      <div class="input-error">
        <p>There ${are} error${s} in your kiln's configuration. Check the following field${s} to see the error message below it.</p>
        <p>The following field${s} have error${s}:</p>
        <ul>${keys.map(key => html`<li>${key}</li>`)}</ul>
        <p>You cannot save your kiln until all errors are fixed.</p>
      </div>`
  } else {
    return ''
  }
}

/**
 * Get a select box of firing types available for the selected kiln
 *
 * @param {object} kiln        All the details for the selected kiln
 * @param {string} fuelType Selected firing type
 *
 * @returns {array} List of option objects to be passed to a select
 *                  field template
 */
const getFuelTypes = (fuelType) => {
  const types = [{
    value: 'electric',
    label: 'Electric'
  }, {
    value: 'gas',
    label: 'Gas'
  }, {
    value: 'wood',
    label: 'Wood'
  }, {
    value: 'oil',
    label: 'Oil'
  }]

  console.group('getFuelTypes()')
  console.log('fuelType:', fuelType)
  console.log('types:', types)
  console.groupEnd()

  return types.map(fType => {
    return {
      ...fType,
      selected: (fType.value === fuelType)
    }
  })
}

export const editKiln = (kiln, kilns, user, eHandler) => {
  const name = (kiln.name === '') ? 'New (unamed) kiln' : kiln.name
  const focusID = getFocusID(kiln.errors, kiln.lastField)
  let nav = ''
  let tmp

  console.group('editkiln()')
  console.log('kiln:', kiln)
  console.log('kilns:', kilns)

  const fields = [
  ]
  // console.log('kiln.kilnID:', kiln.kilnID)

  console.log('kiln.id:', kiln.id)
  console.log('eHandler:', eHandler)

  tmp = (!invalidObject('errors', kiln) && !invalidString('name', kiln.errors, true))
    ? kiln.errors.name
    : ''
  fields.push( // name
    textInputField({
      id: 'name-' + kilnActions.TMP_UPDATE_FIELD,
      required: true,
      label: 'kiln name',
      change: eHandler,
      value: kiln.name,
      desc: tmp,
      error: (tmp !== ''),
      focus: (focusID === 'name'),
      class: 'input-field'
    })
  )

  console.log('kiln.name:', kiln.name)
  console.log('kiln.name !== "":', kiln.name !== '')
  console.log('invalidObject("errors", kiln):', invalidObject('errors', kiln))
  console.log('!invalidObject("errors", kiln):', !invalidObject('errors', kiln))
  console.log('invalidString("name", kiln.errors) !== false:', invalidString('name', kiln.errors) !== false)

  if (kiln.name !== '' && !invalidObject('errors', kiln) && invalidString('name', kiln.errors) !== false) {
    // Must have a valid name before we can progress
    tmp = !invalidString('brand', kiln.errors)
      ? kiln.errors.brand
      : ''
    fields.push( // description
      textInputField({
        id: 'brand-' + kilnActions.TMP_UPDATE_FIELD,
        label: 'Brand',
        change: eHandler,
        value: kiln.brand,
        desc: tmp,
        error: (tmp !== ''),
        focus: (focusID === 'brand'),
        class: 'input-field'
      })
    )
    tmp = !invalidString('model', kiln.errors)
      ? kiln.errors.model
      : ''
    fields.push( // description
      textInputField({
        id: 'model-' + kilnActions.TMP_UPDATE_FIELD,
        label: 'model',
        change: eHandler,
        value: kiln.model,
        desc: tmp,
        error: (tmp !== ''),
        focus: (focusID === 'model'),
        class: 'input-field'
      })
    )

    fields.push( // duration
      selectField({
        // this input should never trigger an event
        id: 'fuel',
        label: 'Energy source',
        eventHandler: eHandler,
        options: [
          {
            value: '',
            label: ' -- Select an energy source -- ',
            selected: false
          },
          ...getFuelTypes(kiln.fuel)
        ],
        change: eHandler,
        focus: (focusID === 'fuel'),
        class: 'input-field'
      })
    )

    tmp = !invalidString('maxTemp', kiln.errors)
      ? kiln.errors.maxTemp
      : ''
    fields.push( // maxTemp
      numberInputField({
        // this input should never trigger an event
        id: 'maxTemp',
        label: 'Maximum temperature',
        value: kiln.maxTemp,
        change: eHandler,
        desc: tmp,
        suffix: html`&deg;C`,
        class: 'input-field'
      })
    )

    tmp = !invalidString('width', kiln.errors)
      ? kiln.errors.width
      : ''
    fields.push( // width
      numberInputField({
        // this input should never trigger an event
        id: 'width',
        label: 'Internal width',
        value: kiln.width,
        change: eHandler,
        desc: tmp,
        class: 'input-field',
        suffix: 'mm'
      })
    )

    tmp = !invalidString('depth', kiln.errors)
      ? kiln.errors.depth
      : ''
    fields.push( // depth
      numberInputField({
        // this input should never trigger an event
        id: 'depth',
        label: 'Internal depth',
        value: kiln.width,
        desc: tmp,
        change: eHandler,
        class: 'input-field',
        suffix: 'mm'
      })
    )

    tmp = !invalidString('height', kiln.errors)
      ? kiln.errors.height
      : ''
    fields.push( // height
      numberInputField({
        // this input should never trigger an event
        id: 'height',
        label: 'Internal height',
        value: kiln.height,
        desc: tmp,
        class: 'input-field',
        change: eHandler,
        suffix: 'mm'
      })
    )

    tmp = !invalidString('maxProgramCount', kiln.errors)
      ? kiln.errors.maxProgramCount
      : ''
    fields.push( // maxProgramCount
      numberInputField({
        // this input should never trigger an event
        id: 'maxProgramCount',
        label: 'Max stored programs',
        value: kiln.maxProgramCount,
        change: eHandler,
        desc: tmp,
        class: 'input-field'
      })
    )

    fields.push(
      checkboxBtnGroup(
        'firingTypes',
        'Allowed firing types',
        kiln,
        firingTypes,
        eHandler
      )
    )
  }

  nav = getErrorMsg(kiln.errors)

  if (nav === '') {
    nav = getNavBar([
      {
        label: 'Save',
        path: '/kilns/save',
        id: kiln.id,
        action: kilnActions.TMP_COMMIT,
        isBtn: true
      }, {
        label: 'Reset',
        path: '/kilns/clear',
        id: kiln.id,
        action: kilnActions.TMP_CLEAR,
        isBtn: true
      }
    ], eHandler)
  }

  console.log('nav:', nav)
  console.log('kiln.errors:', kiln.errors)
  // console.log('Object.keys(kiln.errors):', Object.keys(kiln.errors))
  // console.log('Object.keys(kiln.errors).length:', Object.keys(kiln.errors).length)
  // console.log('Object.keys(kiln.errors).length > 0:', Object.keys(kiln.errors).length > 0)
  console.groupEnd()

  return getMainContent(
    html`<h2>${name}</h2>`,
    html`${getItemList(fields, '', 'input-fields', 'content--bleed')}`,
    nav
  )
}
