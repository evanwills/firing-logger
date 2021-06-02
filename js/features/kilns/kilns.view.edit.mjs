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
import {
  ucFirst
//   auDateStr,
//   boolYesNo,
//   getHourMinSec,
//   getHHMMSS,
//   roundMinutes
//   getDeg,
//   getRate
} from '../../utilities/sanitisation.mjs'
// import { getFiringLogSVG } from '../svg/svg.mjs'
import {
  // invalidBool,
  invalidString,
  invalidObject
} from '../../utilities/validation.mjs'
// import { getNavBar } from '../nav-bar/nav-bar.view.mjs'
import { getFocusID, validKilnTypes, validfuelSources, firingTypes } from './kiln-utils.mjs'
import { getNavBar } from '../nav-bar/nav-bar.view.mjs'
import { checkboxBtnGroup } from '../../shared-views/checkbox.view.mjs'
import { fieldGroup } from '../../shared-views/input-field.view.mjs'

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
  return validfuelSources.map(fType => {
    return {
      value: fType,
      label: ucFirst(fType),
      selected: (fType === fuelType)
    }
  })
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
const getKilnTypes = (kilnType) => {
  return validKilnTypes.map(kType => {
    return {
      value: kType,
      label: ucFirst(kType),
      selected: (kType === kilnType)
    }
  })
}

export const editKiln = (kiln, kilns, user, eHandler) => {
  const name = (kiln.name === '') ? 'New (unamed) kiln' : kiln.name
  const focusID = getFocusID(kiln.errors, kiln.lastField)
  const extraClass = 'input-fields__item input-fields__item--07'
  const idTail = '-' + kilnActions.TMP_UPDATE_FIELD
  let nav = ''
  let tmp

  // console.group('editkiln()')
  // console.log('kiln:', kiln)
  // console.log('kilns:', kilns)

  const fields = [
  ]
  // console.log('kiln.kilnID:', kiln.kilnID)

  // console.log('kiln.id:', kiln.id)
  // console.log('eHandler:', eHandler)

  tmp = (!invalidObject('errors', kiln) && !invalidString('name', kiln.errors, true))
    ? kiln.errors.name
    : ''
  fields.push( // name
    textInputField({
      id: 'name' + idTail,
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

  // console.log('kiln.name:', kiln.name)
  // console.log('kiln.name !== "":', kiln.name !== '')
  // console.log('invalidObject("errors", kiln):', invalidObject('errors', kiln))
  // console.log('!invalidObject("errors", kiln):', !invalidObject('errors', kiln))
  // console.log('invalidString("name", kiln.errors) !== false:', invalidString('name', kiln.errors) !== false)

  if (kiln.name !== '' && !invalidObject('errors', kiln) && invalidString('name', kiln.errors) !== false) {
    // Must have a valid name before we can progress
    tmp = !invalidString('brand', kiln.errors)
      ? kiln.errors.brand
      : ''
    fields.push( // description
      textInputField({
        id: 'brand' + idTail,
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
        id: 'model' + idTail,
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
        id: 'type' + idTail,
        label: 'Kiln type',
        eventHandler: eHandler,
        options: [
          {
            value: '',
            label: ' -- Select kiln type -- ',
            selected: false
          },
          ...getKilnTypes(kiln.type)
        ],
        change: eHandler,
        focus: (focusID === 'fuel'),
        class: 'input-field'
      })
    )

    fields.push( // duration
      selectField({
        // this input should never trigger an event
        id: 'fuel' + idTail,
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
        id: 'maxTemp' + idTail,
        label: 'Max temperature',
        value: kiln.maxTemp,
        change: eHandler,
        desc: tmp,
        suffix: html`&deg;C`,
        max: 1400,
        min: 400,
        step: 1,
        class: 'input-field'
      })
    )

    tmp = {
      width: !invalidString('width', kiln.errors)
        ? kiln.errors.width
        : '',
      depth: !invalidString('depth', kiln.errors)
        ? kiln.errors.depth
        : '',
      height: !invalidString('height', kiln.errors)
        ? kiln.errors.height
        : ''
    }
    fields.push(fieldGroup({
      id: 'packingSpace' + idTail,
      label: 'Packing space',
      fields: [
        {
          className: extraClass,
          children: numberInputField({
            // this input should never trigger an event
            id: 'width' + idTail,
            label: 'Width',
            value: kiln.width,
            change: eHandler,
            desc: tmp.width,
            class: 'input-field',
            max: 2000,
            min: 100,
            step: 1,
            suffix: 'mm'
          })
        },
        {
          className: extraClass,
          children: numberInputField({
            // this input should never trigger an event
            id: 'depth' + idTail,
            label: 'Depth',
            value: kiln.depth,
            desc: tmp.depth,
            change: eHandler,
            class: 'input-field',
            max: 20000,
            min: 100,
            step: 1,
            suffix: 'mm'
          })
        },
        {
          className: extraClass,
          children: numberInputField({
            // this input should never trigger an event
            id: 'height' + idTail,
            label: 'Height',
            value: kiln.height,
            desc: tmp.height,
            class: 'input-field',
            max: 2000,
            min: 100,
            step: 1,
            change: eHandler,
            suffix: 'mm'
          })
        }
      ]
    }))

    tmp = !invalidString('maxProgramCount', kiln.errors)
      ? kiln.errors.maxProgramCount
      : ''
    fields.push( // maxProgramCount
      numberInputField({
        // this input should never trigger an event
        id: 'maxProgramCount' + idTail,
        label: 'Max stored programs',
        value: kiln.maxProgramCount,
        change: eHandler,
        desc: tmp,
        max: 200,
        min: 1,
        step: 1,
        class: 'input-field'
      })
    )

    fields.push({
      isGroup: true,
      children: checkboxBtnGroup(
        'firingTypes-' + kilnActions.TMP_UPDATE_CHECKBOX_FIELD,
        'Allowed firing types',
        kiln,
        firingTypes,
        eHandler
      )
    })
  }

  nav = getErrorMsg(kiln.errors)

  if (nav === '') {
    tmp = []
    if (kiln.mode === kilnActions.UPDATE) {
      if (kiln.installDate === '') {
        tmp = {
          label: 'Installed',
          action: kilnActions.INSTALL
        }
      } else if (kiln.isRetired === false) {
        tmp = {
          label: 'Retire',
          action: kilnActions.RETIRE
        }
      } else {
        tmp = {
          label: 'Resurect',
          action: kilnActions.RESURECT
        }
      }
      tmp = {
        ...tmp,
        id: kiln.id,
        isBtn: true
      }

      tmp = [
        {
          label: (kiln.isWorking) ? 'Set to "Being repaired"' : 'Set to "Working"',
          path: '/kilns/not-working',
          id: kiln.id,
          action: kilnActions.TOGGLE_WORKING,
          isBtn: true
        },
        tmp
      ]
    }

    const navBtns = [
      ...tmp,
      {
        label: 'Save',
        id: kiln.id,
        action: kilnActions.TMP_COMMIT,
        isBtn: true
      }, {
        label: 'Reset',
        id: kiln.id,
        action: kilnActions.TMP_CLEAR,
        isBtn: true
      }
    ]

    nav = getNavBar(navBtns, eHandler)
  }

  // console.log('nav:', nav)
  // console.log('kiln.errors:', kiln.errors)
  // console.log('Object.keys(kiln.errors):', Object.keys(kiln.errors))
  // console.log('Object.keys(kiln.errors).length:', Object.keys(kiln.errors).length)
  // console.log('Object.keys(kiln.errors).length > 0:', Object.keys(kiln.errors).length > 0)
  // console.groupEnd()

  return getMainContent(
    html`<h2>${name}</h2>`,
    html`${getItemList(fields, '', 'input-fields', 'content--bleed')}`,
    nav
  )
}
