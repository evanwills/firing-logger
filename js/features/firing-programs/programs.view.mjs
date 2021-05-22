import { html } from '../../vendor/lit-html/lit-html.mjs'
import { programListItem, singleProgram } from './program.view.mjs'
import { programActions } from './programs.state.actions.mjs'
import { getFilteredPrograms, getKilnName } from './programUtils.mjs'
import { isNonEmptyStr } from '../../utilities/validation.mjs'
import { getMainContent } from '../main-content/main-content.view.mjs'
import { getItemList } from '../item-list/item-list.view.mjs'


export const programsView = (state, kilns, eHandler, routes) => {
  const [route, ...subRoutes] = routes
  let error = ''
  console.group('programsView()')

  console.log('route:', route)
  console.log('subRoutes:', subRoutes)

  // console.log('filters:', getFilteredPrograms(state.filters))

  // const allAvailable = state.all
  let subView = ''

  if (isNonEmptyStr(route)) {
    const prog = state.all.filter(program => program.id === route)
    if (prog.length === 1) {
      subView = singleProgram(prog[0], getKilnName(prog[0].kilnID, kilns), eHandler)
    } else {
      error = html`<p class="error"></p>Could not find firing program matching ID: <code>${route}</code></p>`
    }
  }

  if (subView === '') {
    const programs = state.all.filter(getFilteredPrograms(state.filters))
    subView = getMainContent(
      html`<h2>All available programs</h2>`,
      html`${error}
        ${getItemList(
          programs.map(program => programListItem(program.id, program.name, program.type, program.maxTemp, program.duration, '', program.isUsed, getKilnName(program.kilnID, kilns), eHandler)),
          '',
          '',
          'content--bleed'
      )}
      `
    )
  }
  console.groupEnd()

  return html`<section id="programs" class="programs">
    ${(error !== '') ? html`${error}</p>` : ''}
    ${subView}
  </section>`
}
