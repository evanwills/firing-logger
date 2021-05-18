import { html } from '../../vendor/lit-html/lit-html.mjs'
import { isStr } from '../../utilities/validation.mjs'
import { selectField } from '../../view/shared-components/input-field.view.mjs'
import { getHourMinSec, ucFirst } from '../../utilities/sanitisation.mjs'

export const programListItem = (id, name, type, maxTemp, duration, SVG, isUsed, eHandler) => {
  return html`
    <a href="/programs/${id}", id="${id}-programs-view" class="program-item" click=${eHandler}>
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
