import { html } from '../../vendor/lit-html/lit-html.mjs'
import { programListItem, singleProgram } from './program.view.mjs'
import { programActions } from './programs.state.actions.mjs'
import { getFilteredPrograms, getKilnName } from './programUtils.mjs'
import { isNonEmptyStr } from '../../utilities/validation.mjs'

export const listPrograms = (allPrograms, allKilns, filters, eHandler) => {
  console.group('listPrograms()')

  console.log('allPrograms:', allPrograms)
  console.log('filters:', filters)
  console.log('allKilns:', allKilns)
  console.groupEnd()

  return html`
    <p>List of firing programs</p>
    <ul class="item-list">
      ${allPrograms.map((program) => {
        return html`
          <li class="item-list__item">
            ${programListItem(program.id, program.name, program.type, program.maxTemp, program.duration, '', program.isUsed, getKilnName(program.kilnID, allKilns), eHandler)}
          </li>`
      })}
    </ul>
  `
}

export const programsView = (state, kilns, eHandler, routes) => {
  const [route, ...subRoutes] = routes
  let error = ''
  console.group('programsView()')

  console.log('route:', route)
  console.log('subRoutes:', subRoutes)

  // console.log('filters:', getFilteredPrograms(state.filters))

  // const allAvailable = state.all
  const allAvailable = state.all.filter(getFilteredPrograms(state.filters))
  let subView = ''

  if (allAvailable.length === 0) {
    subView = html`<button id="_${programActions.ADD}" @click=${eHandler}>Add a program</button>`
  } else if (isNonEmptyStr(route)) {
    const prog = state.all.filter(program => program.id === route)
    if (prog.length === 1) {
      subView = singleProgram(prog[0], getKilnName(prog[0].kilnID, kilns), eHandler)
    } else {
      error = html`Could not find firing program matching ID: <code>${route}</code>`
      subView = listPrograms(allAvailable, kilns, state.filters, eHandler)
    }
  } else {
    subView = listPrograms(allAvailable, kilns, state.filters, eHandler)
  }
  console.groupEnd()

  return html`<section id="programs" class="programs">
    ${(error !== '') ? html`<p class="error">${error}</p>` : ''}
    ${subView}
  </section>`
}
