import {
  // numberInputField,
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
  // invalidString,
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

  // console.group('editProgram()')
  // console.log('kiln:', kiln)
  // console.log('programType:', programType)
  // console.log('types:', types)
  // console.groupEnd()

  return types.filter(fType => !invalidBool(fType.value, kiln, true)).map(fType => {
    return {
      ...fType,
      selected: (fType.value === programType)
    }
  })
}

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

  // console.group('editProgram()')
  // console.log('program:', program)
  // console.log('kilns:', kilns)

  const fields = [
    textInputField({
      id: 'name-' + programActions.TMP_UPDATE_FIELD,
      required: true,
      label: 'Program name',
      change: eHandler,
      value: program.name
    }),
    textInputField({
      id: 'description-' + programActions.TMP_UPDATE_FIELD,
      required: true,
      label: 'Description',
      change: eHandler,
      value: program.description
    }, true)
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
      ]
    }))
    fields.push(
      textInputField({
        id: 'maxTemp',
        readonly: true,
        label: 'Maximum temperature',
        value: program.maxTemp + '&deg;C'
      })
    )
    fields.push(
      textInputField({
        id: 'duration',
        readonly: true,
        label: 'Firing duration',
        value: getHourMinSec(program.duration)
      })
    )
    if (program.maxTemp > 400) {
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

  // console.groupEnd()

  return getMainContent(
    html`<h2>${name}</h2>`,
    html`${getItemList(fields, '', 'input-fields', 'content--bleed')}
    ${(program.kilnID !== '')
      ? html`<h3>Steps</h3>
        <div class="firing-steps">
          ${getFiringLogSVG(program.maxTemp, program.duration, program.steps, [], false)}
          ${programSteps(steps, kilns[0].maxTemp, eHandler)}
        </div>`
      : ''
    }`,
    nav
  )
}
