import { html } from '../../vendor/lit-html/lit-html.mjs'
// import { isStr } from '../../utilities/validation.mjs'
// import { selectField } from '../../shared-views/input-field.view.mjs'
import { getNavBar } from '../nav-bar/nav-bar.view.mjs'
import { getHourMinSec, getHHMMSS, ucFirst, auDateStr, boolYesNo, getDeg, getRate, roundMinutes } from '../../utilities/sanitisation.mjs'
import { programActions } from './programs.state.actions.mjs'
import { viewActions } from '../mainApp/view.state.mjs'
import { getFiringLogSVG } from '../svg/svg.mjs'
import { getMainContent } from '../main-content/main-content.view.mjs'

export const programListItem = (id, name, type, maxTemp, duration, SVG, isUsed, kilnName, eHandler) => {
  return html`
    <a href="/programs/${id}" id="${id}-${viewActions.SET}-program" class="program-item item-list__link" @click=${eHandler} title="View full details of &ldquo;${name}&rdquo; firing program">
       <h2 class="item-link__name">
         ${name}
       </h2>
       <p class="item-link__sub-name">
        <span class="sr-only">
          Kiln:
        </span>
        ${ucFirst(kilnName)}
       </p>
       <p class="item-link__type">
        <span class="sr-only">
          Firing type:
        </span>
        ${ucFirst(type)}
       </p>
       <p class="item-link__max">
        <span class="sr-only">
          Maximum temperature:
        </span>
        ${getDeg(maxTemp)}
       </p>
       <p class="program-item__time">
        <span class="sr-only">
          Total firing time:
        </span>
        ${getHourMinSec(roundMinutes(duration))}
       </p>
       <!-- SVG -->
     </a>
  `
}

// const getUnique = (alls, prop) => {
//   const uniques = []

//   for (let a = 0; a < alls.length; a += 1) {
//     if (typeof alls[prop] !== 'undefined' && uniques.indexOf(alls[prop]) === -1) {
//       uniques.push(alls[prop])
//     }
//   }
//   return uniques
// }

// const getKilnsFilter = (kilnIDs, allKilns, selectedKiln, eHandler) => {
//   const _id = isStr(selectedKiln) ? selectedKiln : ''
//   const _kilns = allKilns.filter(kiln => (kilnIDs.indexOf(kiln.id) > 1)).map(kiln => {
//     return {
//       id: kiln.id,
//       name: kiln.name,
//       selected: (kiln.id === _id)
//     }
//   })

//   if (_kilns.length > 1) {
//     return selectField({
//       id: 'kiln-programs-filter',
//       options: [{ id: '', name: '-- kiln --' }, ..._kilns],
//       eventHandler: eHandler,
//       label: 'Kilns'
//     })
//   } else {
//     return ''
//   }
// }

// export const programListFilters = (currentFilters, allFirings, allKilns, eHandler) => {
//   if (allFirings.length > 10) {
//     const firingType = getUnique(allFirings, 'type')
//     const maxTemp = getUnique(allFirings, 'maxTemp')
//     const duration = getUnique(allFirings, 'duration')

//     return html`
//       <div>
//         ${getKilnsFilter(
//           getUnique(allFirings, 'kilnID'),
//           allKilns,
//           currentFilters.kilns,
//           eHandler
//         )}
//       </div>
//     `
//   }
// }

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
          // console.log('time:', time)
          // console.log('totalDuration:', totalDuration)

          return html`
          <tr>
            <th>${(i + 1)}</th>
            <td class="program-steps__max">${getDeg(step.endTemp)}</td>
            <td class="program-steps__rate">${getRate(step.rate)}</td>
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
export const singleProgram = (state, kilnName, eHandler) => {
  console.group('singleProgram')
  const id = state.id
  console.log('state:', state)
  console.groupEnd()

  let actionLinks = []
  if (state.useCount > 0) {
    actionLinks = [...actionLinks, {
      label: 'View past firings',
      path: '/logs/by-program',
      id: id,
      action: ''
    }]
  }

  if (state.superseded === false && state.deleted === false) {
    actionLinks = [
      ...actionLinks,
      {
      //   label: 'Book a firing',
      //   path: '/diary/new',
      //   id: id,
      //   action: ''
      // }, {
        label: 'Start a firing',
        path: '/logs/new',
        id: id,
        action: ''
      }, {
        label: 'Edit',
        path: '/programs/edit',
        id: id,
        action: programActions.UPDATE
      }, {
        label: 'Copy',
        path: '/programs/copy',
        id: id,
        action: programActions.CLONE
      }, {
        label: 'Delete',
        path: '/programs/delete',
        id: id,
        action: programActions.DELETE
      }
    ]
  }

  // actionLinks = [
  //   ...actionLinks,
  //   {
  //     label: 'Kiln maintenance history',
  //     path: '/maintenance/by-kiln',
  //     id: state.kilnID,
  //     action: ''
  //   }, {
  //     label: 'Report an issue with this kiln',
  //     path: '/maintenance/report',
  //     id: state.kilnID,
  //     action: ''
  //   }
  // ]

  return getMainContent(
    html`
      <h2>${state.name}</h2>
      <h3><span class="program__head__kiln">Kiln:</span> ${kilnName}</h3>
    `,
    html`
    <p>${state.description}</p>

    <h3>Steps</h3>
    <div class="firing-steps">
      ${getFiringLogSVG(state.maxTemp, state.duration, state.steps, [], false)}
      ${programSteps(state.steps)}
    </div>

    <h3>Details</h3>

    <dl class="program-fields content--bleed">
      <dt class="program-fields__key">Kiln</dt>
        <dd class="program-fields__val">${kilnName}</dd>

      <dt class="program-fields__key">Program No.</dt>
        <dd class="program-fields__val">${state.controllerProgramID}</dd>

      <dt class="program-fields__key">Firing type</dt>
        <dd class="program-fields__val">${state.type}</dd>

      <dt class="program-fields__key">Version</dt>
        <dd class="program-fields__val">${state.version}</dd>

      <dt class="program-fields__key">Max temp</dt>
        <dd class="program-fields__val">${getDeg(state.maxTemp)}</dd>

      <dt class="program-fields__key">Total firing time</dt>
        <dd class="program-fields__val">${getHourMinSec(state.duration)}</dd>

      <dt class="program-fields__key">Average rate</dt>
        <dd class="program-fields__val">${getRate(state.averageRate)}</dd>

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
    `,
    html`${getNavBar(actionLinks, eHandler)}`,
    'program'
  )
}
