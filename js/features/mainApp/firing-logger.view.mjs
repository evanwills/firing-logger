import { programsView } from '../firing-programs/programs.view.mjs'
import { kilnsView } from '../kilns/kilns.view.mjs'
import { render, html } from '../../vendor/lit-html/lit-html.mjs'

export const firingLoggerView = (domNode, state, eHandler) => () => {
  console.log('inside firingLoggerView()')

  const { route, ...subRoutes } = state.view.route

  let subView = ''

  switch (route) {
    case 'programs':
      subView = programsView(state.programs, eHandler, subRoutes)
      break

    case 'kilns':
      subView = kilnsView(state.kilns, eHandler, subRoutes)
      break

    // case 'logs':
    //   subView = logsView(state.kilns, subRoutes, eHandler)
    //   break
  }

  render(html`<h1>Firing logger</h1> ${subView}`, domNode)
}
