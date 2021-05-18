import { html } from '../../vendor/lit-html/lit-html.mjs'
import { programListItem } from './program.view.mjs'

export const listPrograms = (allPrograms, filters, eHandler) => {
  console.group('listPrograms()')

  console.log('allPrograms:', allPrograms)
  console.log('filters:', filters)
  console.groupEnd()

  return html`
    <p>List of firing programs</p>
    <ul>
      ${allPrograms.map((program) => {
        return html`<li>${programListItem(program.id, program.name, program.type, program.maxTemp, program.duration, '', program.isUsed, eHandler)}</li>`
      })}
    </ul>
  `
}

export const programsView = (state, eHandler, routes) => {
  const { route, ...subRoutes } = routes
  console.group('programsView()')

  console.log('route:', route)
  console.log('subRoutes:', subRoutes)

  let subView = ''

  switch (route) {
    default:
      subView = listPrograms(state.all, state.filters, eHandler)
  }

  console.groupEnd()

  return html`<section id="programs" class="programs">
    <h2>Programs</h2>
    ${subView}
  </section>`
}
