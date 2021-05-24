import {
  numberInputField,
  selectField,
  textInputField
} from '../../shared-views/input-field.view.mjs'
import { html } from '../../vendor/lit-html/lit-html.mjs'
import { getMainContent } from '../main-content/main-content.view.mjs'
import { programActions } from './programs.state.actions.mjs'
import { getItemList } from '../item-list/item-list.view.mjs'
import {
  // ucFirst,
  // auDateStr,
  // boolYesNo,
  getHourMinSec,
  getHHMMSS
} from '../../utilities/sanitisation.mjs'
import { getFiringLogSVG } from '../svg/svg.mjs'
import {
  invalidString,
  invalidBool
} from '../../utilities/validation.mjs'
import { getNavBar } from '../nav-bar/nav-bar.view.mjs'

const kilnsToOptions = (id) => (kiln) => {
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
        <p>There ${are} error${s} in your program's configuration. Check the following field${s} to see the error message below it.</p>
        <p>The following field${s} have error${s}:</p>
        <ul>${keys.map(key => html`<li>${key}</li>`)}</ul>
        <p>You cannot save your program until all errors are fixed.</p>
      </div>`
  } else {
    return ''
  }
}

/**
 * Get a select box of firing types available for the selected kiln
 *
 * @param {object} kiln        All the details for the selected kiln
 * @param {string} programType Selected firing type
 *
 * @returns {array} List of option objects to be passed to a select
 *                  field template
 */
const getFiringTypes = (kiln, programType) => {
  const types = [{
    value: 'bisque',
    label: 'Bisque'
  }, {
    value: 'glaze',
    label: 'Glaze'
  }, {
    value: 'single',
    label: 'Single firing (Bisque & glaze in one)'
  }, {
    value: 'luster',
    label: 'Luster'
  }, {
    value: 'onglaze',
    label: 'Onglaze'
  }]

  console.group('getFiringTypes()')
  console.log('kiln:', kiln)
  console.log('programType:', programType)
  console.log('types:', types)
  console.groupEnd()

  return types.filter(fType => !invalidBool(fType.value, kiln, true)).map(fType => {
    return {
      ...fType,
      selected: (fType.value === programType)
    }
  })
}

/**
 * Get a list of program step input fields
 *
 * @param {array}    steps    List of program steps
 * @param {number}   kilnMax  Maximum temperature of the kiln
 * @param {function} eHandler Event handler (redux store auto dispatcher)
 *
 * @returns {html}
 */
const programSteps = (steps, kilnMax, eHandler) => {
  let lastTmp = 0
  let totalDuration = 0
  return html`
    <table class="program-steps">
      <thead>
        <tr>
          <th id="steps">Step</th>
          <th id="top-temp">Top temp<span class="not-sm">erature</span></th>
          <th id="rate">
            Rate
            <!-- <span class="not-sm">(degrees per hour)</span> -->
          </th>
          <th id="hold-time">Hold time (minutes)</th>
          <th id="duration">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${steps.map((step, a) => {
          let diff = 0
          let duration = ''
          // console.group('programSteps() -> map()')
          const endTemp = step.endTemp * 1
          const rate = step.rate * 1
          const hold = step.hold * 1

          if (endTemp > 0 && rate > 0) {
            // console.log('step:', step)
            // console.log('a:', a)
            // console.log('lastTmp:', lastTmp)
            diff = (lastTmp < endTemp)
              ? endTemp - lastTmp
              : lastTmp - endTemp
            lastTmp = endTemp

            // console.log('diff:', diff)
            // console.log('endTemp:', endTemp)
            // console.log('diff:', diff)
            const time = (rate > 0)
            ? (((diff / rate) * 3600) + (hold * 60))
            : 0
            // console.log('time:', time)
            duration = getHHMMSS(time, true)

            totalDuration += time
          }
          // console.log('time:', time)
          // console.log('totalDuration:', totalDuration)
          const b = a + 1

          // console.groupEnd()

          return html`
          <tr>
            <th id="step-${b}" headers="steps">${b}</th>
            <td class="program-steps__max" headers="step-${b} top-temp">
              <input type="number" id="endTemp-${programActions.TMP_UPDATE_STEP}-${a}" .value="${step.endTemp}" class="program-steps__input" max="${kilnMax}" step="1" min="0" pattern="^(?:(?:1[0-3]|[1-9])[0-9]{2}|[1-9][0-9]?)$" aria-label="Maximum temperature for step ${b}" @change=${eHandler} />
              &deg;C
            </td>
            <td class="program-steps__rate" headers="step-${b} rate">
              <input type="number" id="rate-${programActions.TMP_UPDATE_STEP}-${a}" .value="${step.rate}" class="program-steps__input" step="1" min="0" max="250" pattern="^([12][0-9]{2}|[1-9][0-9]?)$" aria-label="Rate of temperature climb for step ${b}" @change=${eHandler} />&deg; / hr
            </td>
            <td class="program-steps__hold" headers="step-${b} hold-time">
            <input type="number" id="hold-${programActions.TMP_UPDATE_STEP}-${a}" .value="${step.hold}" class="program-steps__input" step="1" min="0" max="250" aria-label="Number of minutes to hold for step ${b}" pattern="^([12][0-9]{2}|[1-9][0-9]?)$" @change=${eHandler} /> <span class="not-sm">minutes</span>
            </td>
            <td class="program-steps__time" headers="step-${b} duration">
              ${duration}
            </td>
          </tr>
        `
        })}
      </tbody>
      <tfoot>
        <tr>
          <th colspan="4">Total firing time</th>
          <td>${getHHMMSS(totalDuration, true)}</td>
        </tr>
      </tfoot>
    </table>
  `
}

export const editProgram = (program, kilns, user, eHandler) => {
  const name = (program.name === '') ? 'New (unamed) program' : program.name
  let nav = ''
  let stepBlock = ''

  console.group('editProgram()')
  console.log('program:', program)
  console.log('kilns:', kilns)

  const fields = [
  ]

  const kilns_ = (program.mode === programActions.ADD)
    ? kilns.filter(kiln => !kiln.retired)
    : kilns.filter(kiln => kiln.id === program.kilnID)

  fields.push(selectField({
    id: 'kilnID-' + programActions.TMP_UPDATE_FIELD,
    required: true,
    label: 'Kiln',
    eventHandler: eHandler,
    options: [
      {
        value: '',
        label: ' -- Select a kiln --',
        selected: false
      },
      ...kilns_.map(kilnsToOptions(program.kilnID))
    ]
  }))
  // console.log('program.kilnID:', program.kilnID)

  if (program.kilnID !== '') {
    console.log('program.kilnID:', program.kilnID)

    fields.push(textInputField({
      id: 'name-' + programActions.TMP_UPDATE_FIELD,
      required: true,
      label: 'Program name',
      change: eHandler,
      value: program.name,
      desc: (!invalidString('name', program.errors, true))
        ? program.errors.name
        : '',
      error: !invalidString('name', program.errors)
    }))
    if (program.name !== '' && invalidString('name', program.errors)) {
      // Must have a valid name before we can progress
      fields.push(textInputField({
        id: 'description-' + programActions.TMP_UPDATE_FIELD,
        required: true,
        label: 'Description',
        change: eHandler,
        value: program.description,
        desc: !invalidString('description', program.errors)
          ? program.errors.description
          : '',
        error: !invalidString('description', program.errors)
      }, true))

      fields.push(selectField({
        id: 'type-' + programActions.TMP_UPDATE_FIELD,
        required: true,
        label: 'Firing type',
        eventHandler: eHandler,
        options: [
          {
            value: '',
            label: ' -- Select a firing type --',
            selected: false
          },
          ...getFiringTypes(kilns_[0], program.type)
        ],
        desc: !invalidString('type', program.errors)
          ? program.errors.type
          : '',
        error: !invalidString('type', program.errors)
      }))

      fields.push(
        numberInputField({
          id: 'controllerProgramID-' + programActions.TMP_UPDATE_FIELD,
          label: 'Controller program ID',
          value: program.controllerProgramID,
          min: 0,
          max: kilns[0].maxProgramID,
          step: 1,
          desc: !invalidString('controllerProgramID', program.errors)
            ? program.errors.controllerProgramID
            : '',
          error: !invalidString('controllerProgramID', program.errors)
        })
      )

      fields.push(
        textInputField({
          id: 'maxTemp-' + programActions.TMP_UPDATE_FIELD,
          readonly: true,
          label: 'Maximum temperature',
          value: program.maxTemp + '&deg;C'
        })
      )

      fields.push(
        textInputField({
          id: 'duration-' + programActions.TMP_UPDATE_FIELD,
          readonly: true,
          label: 'Firing duration',
          value: getHourMinSec(program.duration)
        })
      )

      fields.push(
        textInputField({
          id: 'maxTemp-' + programActions.TMP_UPDATE_FIELD,
          readonly: true,
          label: 'Average rate of climb',
          value: program.averageRate + '&deg;C / hour'
        })
      )

      nav = getErrorMsg(program.errors)

      if (nav === '' && program.maxTemp > 400) {
        nav = getNavBar([
          {
            label: 'Save',
            path: '/programs/save',
            id: '-' + programActions.TMP_COMMIT,
            action: programActions.TMP_COMMIT
          }, {
            label: 'Reset',
            path: '/programs/clear',
            id: '-' + programActions.TMP_CLEAR,
            action: programActions.TMP_CLEAR
          }
        ])
      }

      const lastStep = program.steps.length - 1

      // console.log('lastStep:', lastStep)
      // console.log('program.steps[' + lastStep + ']:', program.steps[lastStep])
      // console.log('program.steps[' + lastStep + '].endTemp:', program.steps[lastStep].endTemp)
      // console.log('program.steps[' + lastStep + '].rate:', program.steps[lastStep].rate)
      // console.log('program.steps[' + lastStep + '].hold:', program.steps[lastStep].hold)
      const steps = (program.steps[lastStep].endTemp > 0 && program.steps[lastStep].rate > 1)
        ? [...program.steps, { endTemp: 0, rate: 0, hold: 0 }]
        : program.steps

      stepBlock = html`
        <h3>Steps</h3>
        <div class="firing-steps">
          ${getFiringLogSVG(program.maxTemp, program.duration, program.steps, [], false)}
          ${programSteps(steps, kilns[0].maxTemp, eHandler)}
        </div>
      `
    }
  } else {
    nav = getErrorMsg(program.errors)
  }

  console.log('nav:', nav)
  console.log('program.errors:', program.errors)
  console.log('Object.keys(program.errors):', Object.keys(program.errors))
  console.log('Object.keys(program.errors).length:', Object.keys(program.errors).length)
  console.log('Object.keys(program.errors).length > 0:', Object.keys(program.errors).length > 0)
  console.groupEnd()

  return getMainContent(
    html`<h2>${name}</h2>`,
    html`${getItemList(fields, '', 'input-fields', 'content--bleed')}
    ${stepBlock}`,
    nav
  )
}
