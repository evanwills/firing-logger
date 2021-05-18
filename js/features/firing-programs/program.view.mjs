import { html } from '../../vendor/lit-html/lit-html.mjs'
import { isStr } from '../../utilities/validation.mjs'
import { selectField } from '../../view/shared-components/input-field.view.mjs'
import { getHourMinSec, getHHMMSS, ucFirst, auDateStr, boolYesNo} from '../../utilities/sanitisation.mjs'
import { programActions } from './programs.actions.state.mjs'

export const programListItem = (id, name, type, maxTemp, duration, SVG, isUsed, eHandler) => {
  return html`
    <a href="/programs/${id}" id="${id}-programs-view" class="program-item" @click=${eHandler}>
       <h2 class="program-item__name">
         ${name}
       </h2>
       <p class="program-item__type">
        <span class="sr-only">
          Firing type:
        </span>
        ${ucFirst(type)}
       </p>
       <p class="program-item__max">
        <span class="sr-only">
          Maximum temperature:
        </span>
        ${maxTemp}&deg;C
       </p>
       <p class="program-item__time">
        <span class="sr-only">
          Total firing time:
        </span>
        ${getHourMinSec(duration)}
       </p>
       <!-- SVG -->
     </a>
  `
}

const getUnique = (alls, prop) => {
  const uniques = []

  for (let a = 0; a < alls.length; a += 1) {
    if (typeof alls[prop] !== 'undefined' && uniques.indexOf(alls[prop]) === -1) {
      uniques.push(alls[prop])
    }
  }
  return uniques
}

const getKilnsFilter = (kilnIDs, allKilns, selectedKiln, eHandler) => {
  const _id = isStr(selectedKiln) ? selectedKiln : ''
  const _kilns = allKilns.filter(kiln => (kilnIDs.indexOf(kiln.id) > 1)).map(kiln => {
    return {
      id: kiln.id,
      name: kiln.name,
      selected: (kiln.id === _id)
    }
  })

  if (_kilns.length > 1) {
    return selectField({
      id: 'kiln-programs-filter',
      options: [{ id: '', name: '-- kiln --' }, ..._kilns],
      eventHandler: eHandler,
      label: 'Kilns'
    })
  } else {
    return ''
  }
}

export const programListFilters = (currentFilters, allFirings, allKilns, eHandler) => {
  if (allFirings.length > 10) {
    const firingType = getUnique(allFirings, 'type')
    const maxTemp = getUnique(allFirings, 'maxTemp')
    const duration = getUnique(allFirings, 'duration')

    return html`
      <div>
        ${getKilnsFilter(
          getUnique(allFirings, 'kilnID'),
          allKilns,
          currentFilters.kilns,
          eHandler
        )}
      </div>
    `
  }
}

export const programSteps = (steps) => {
  let lastTmp = 0
  let totalDuration = 0
  return html`
    <table class="program-steps">
      <thead>
        <tr>
          <th>Step</th>
          <th>Top temp<span class="not-sm">erature</span></th>
          <th>
            Rate
            <!-- <span class="not-sm">(degrees per hour)</span> -->
          </th>
          <th>Hold time (minutes)</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        ${steps.map((step, i) => {
          const diff = (lastTmp < step.endTemp)
            ? step.endTemp - lastTmp
            : lastTmp - step.endTemp
          lastTmp = step.endTemp

          const time = (((diff / step.rate) * 3600) + (step.hold * 60))
          const duration = getHHMMSS(time, true)

          totalDuration += time
          console.log('time:', time)
          console.log('totalDuration:', totalDuration)

          return html`
          <tr>
            <th>${(i + 1)}</th>
            <td class="program-steps__max">${step.endTemp}&deg;C</td>
            <td class="program-steps__rate">${step.rate}&deg; / hr</td>
            <td class="program-steps__hold">${step.hold} <span class="not-sm">minutes</span></td>
            <td class="program-steps__time">${duration}</td>
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
export const singleProgram = (state, eHandler) => {
  console.group('singleProgram')
  console.log('state:', state)
  console.groupEnd()
  return html`
    <article class="program">
      <header>
        <h2>${state.name}</h2>
      </header>
      <p>${state.description}</p>

      <h3>Steps</h3>
      ${programSteps(state.steps)}

      <h3>Details</h3>

      <dl class="program-fields">
        <dt class="program-fields__key">Kiln</dt>
          <dd class="program-fields__val">${state.kilnID}</dd>

        <dt class="program-fields__key">Program No.</dt>
          <dd class="program-fields__val">${state.controllerProgramID}</dd>

        <dt class="program-fields__key">Firing type</dt>
          <dd class="program-fields__val">${state.type}</dd>

        <dt class="program-fields__key">Version</dt>
          <dd class="program-fields__val">${state.version}</dd>

        <dt class="program-fields__key">Max temp</dt>
          <dd class="program-fields__val">${state.maxTemp}&deg;C</dd>

        <dt class="program-fields__key">Total firing time</dt>
          <dd class="program-fields__val">${getHourMinSec(state.duration)}</dd>

        <dt class="program-fields__key">Created</dt>
          <dd class="program-fields__val">
            ${auDateStr(state.created, true)} <br />
            by: ${state.createdBy}
          </dd>

        <dt class="program-fields__key">Superseded</dt>
          <dd class="program-fields__val">${boolYesNo(state.superseded)}</dd>

        <dt class="program-fields__key">Used</dt>
          <dd class="program-fields__val">${boolYesNo(state.used)}</dd>

        <dt class="program-fields__key">Usage count</dt>
          <dd class="program-fields__val">${state.useCount}</dd>
      </dl>
      <footer>
        ${(state.superseded === false && state.deleted === false)
          ? html`
            <button .id="${state.id}-${programActions.UPDATE}" @click=${eHandler}>
              Book a firing
            </button>
            <button .id="${state.id}-${programActions.UPDATE}" @click=${eHandler}>
              Start a firing
            </button>`
          : ''
        }
        ${(state.useCount > 0) ? html`<button click=${eHandler}>View past firings</button>` : ''}
        <button .id="${state.id}-${programActions.UPDATE}" @click=${eHandler}>Edit</button>
        <button .id="${state.id}-${programActions.CLONE}" @click=${eHandler}>Copy</button>
        <button .id="${state.id}-${programActions.DELETE}" @click=${eHandler}>Delete</button>
        <button @click=${eHandler}>Maintenance history</button>
        <button @click=${eHandler}>Report an issue</button>
      </footer>
    </article>
  `
}
