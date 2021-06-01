import {
  numberInputField,
  selectField,
  textInputField,
  nonInputField
} from '../../shared-views/input-field.view.mjs'
import { html } from '../../vendor/lit-html/lit-html.mjs'
import { getMainContent } from '../main-content/main-content.view.mjs'
import { kilnActions } from './kilns.state.actions.mjs'
import { getItemList } from '../item-list/item-list.view.mjs'
import {
  // ucFirst,
  // auDateStr,
  // boolYesNo,
  getHourMinSec,
  // getHHMMSS,
  roundMinutes
  // getDeg,
  // getRate
} from '../../utilities/sanitisation.mjs'
// import { getFiringLogSVG } from '../svg/svg.mjs'
import {
  // invalidBool,
  invalidString,
  invalidObject
} from '../../utilities/validation.mjs'
// import { getNavBar } from '../nav-bar/nav-bar.view.mjs'
import { getFocusID } from './kiln-utils.mjs'

const fuelToOptions = (id) => (kiln) => {
  return {
    value: kiln.id,
    label: kiln.name,
    selected: (kiln.id === id)
  }
}

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

  console.log('kiln.kilnID:', kiln.kilnID)

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
      focus: (focusID === 'name')
    })
  )
  if (kiln.name !== '' && !invalidObject('errors', kiln) && invalidString('name', kiln.errors)) {
    // Must have a valid name before we can progress
    tmp = !invalidString('description', kiln.errors)
      ? kiln.errors.description
      : ''
    fields.push( // description
      textInputField({
        id: 'description-' + kilnActions.TMP_UPDATE_FIELD,
        label: 'Description',
        change: eHandler,
        value: kiln.description,
        desc: tmp,
        error: (tmp !== ''),
        focus: (focusID === 'description')
      }, true)
    )

    fields.push( // maxTemp
      nonInputField({
        // this input should never trigger an event
        id: 'maxTemp',
        readonly: true,
        label: 'Maximum temperature',
        value: kiln.maxTemp,
        suffix: html`&deg;C`
      })
    )

    fields.push( // duration
      textInputField({
        // this input should never trigger an event
        id: 'duration',
        readonly: true,
        label: 'Firing duration',
        value: getHourMinSec(roundMinutes(kiln.duration), true)
      })
    )

    fields.push( // averageRate
      nonInputField({
        // this input should never trigger an event
        id: 'averageRate',
        readonly: true,
        label: 'Average rate of climb',
        value: kiln.averageRate,
        suffix: html`&deg;C / hr`
      })
    )

    nav = getErrorMsg(kiln.errors)
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
