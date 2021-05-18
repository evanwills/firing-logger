import { programsView } from '../firing-programs/programs.view.mjs'
import { kilnsView } from '../kilns/kilns.view.mjs'
import { logsView } from '../logs/logs.view.mjs'
import { render, html } from '../../vendor/lit-html/lit-html.mjs'
import { store } from '../../features/mainApp/firing-logger.state.mjs'

export const firingLoggerView = (domNode, eHandler) => () => {
  console.group('firingLoggerView()')
  console.log('eHandler:', eHandler)
  const state = store.getState()
  const [route, ...subRoutes] = state.view.route

  let subView = ''

  switch (route) {
    case 'programs':
      // console.log('state:', state)
      // console.log('state.studio:', state.studio)
      // console.log('state.studio.firingPrograms:', state.studio.firingPrograms)
      subView = programsView(state.studio.firingPrograms, eHandler, subRoutes)
      break

    case 'kilns':
      // console.log('state:', state)
      // console.log('state.studio:', state.studio)
      // console.log('state.studio.kilns:', state.studio.kilns)
      subView = kilnsView(state.studio.kilns, eHandler, subRoutes)
      break

    case 'logs':
      // console.log('state:', state)
      // console.log('state.studio:', state.studio)
      // console.log('state.studio.logs:', state.studio.logs)
      subView = logsView(state.studio.logs, subRoutes, eHandler)
      break
  }
  console.groupEnd()

  render(
    html`
    <div class="firing-logger">
      <header>
        <h1>Firing logger</h1>
      </header>
      ${subView}
    </div>`,
    domNode
  )
}
