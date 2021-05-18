import { html } from '../../vendor/lit-html/lit-html.mjs'

export const listLogs = (allLogs, filters, eHandler) => {
  return html`<p>List of firing logs</p>`
}


export const logsView = (state, eHandler, routes) => {
  const { route, ...subRoutes } = routes

  console.group('logsView()')
  console.log('route:', route)
  console.log('subRoutes:', subRoutes)
  console.log('state:', state)

  let subView = ''

  switch (route) {
    default:
      subView = listLogs(state.all, state.filters, eHandler)
  }

  console.groupEnd()
  return html`<section id="programs" class="programs">
    <h2>Firing logs</h2>
    ${subView}
  </section>`
}
