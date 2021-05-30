import { render, html } from '../../vendor/lit-html/lit-html.mjs'
import { store } from '../../features/mainApp/firing-logger.state.mjs'
import { invalidString } from '../../utilities/validation.mjs'
import { programsView } from '../firing-programs/programs.view.mjs'
import { kilnsView } from '../kilns/kilns.view.mjs'
import { logsView } from '../logs/logs.view.mjs'
// import { getLink } from '../../shared-views/navigation.view.mjs'
import { header } from '../header/header.view.mjs'
import { focuser } from '../../utilities/general.mjs'

export const firingLoggerView = (domNode, eHandler, titleTag) => () => {
  console.group('firingLoggerView()')
  // console.log('eHandler:', eHandler)
  const state = store.getState()
  // console.log('state:', state)
  if (state.render === false) {
    // We're not ready to show anything yet
    console.log('not ready to show anything yet')
    return ''
  }

  console.log('state.view:', state.view)
  console.log('state.view.route:', state.view.route)
  const [route, ...subRoutes] = state.view.route
  const uiMode = 'ui-darkmode'
  const hasTitle = (!invalidString('title', state.view, true))
  const title = (hasTitle === true) ? state.view.title : ''
  const titleTxt = (hasTitle === true) ? ': ' + state.view.title : ''
  console.log('route:', route)

  let subView = ''
  switch (route) {
    case 'programs':
      console.log('state.studio.firingPrograms:', state.studio.firingPrograms)
      console.log('state.studio.kilns.all:', state.studio.kilns.all)

      subView = programsView(
        state.studio.firingPrograms,
        state.studio.kilns.all,
        eHandler,
        subRoutes,
        focuser
      )
      break

    case 'kilns':
      subView = kilnsView(
        state.studio.kilns,
        eHandler,
        subRoutes,
        focuser
      )
      break

    case 'logs':
      subView = logsView(
        state.studio.logs,
        eHandler,
        subRoutes,
        focuser
      )
      break
  }

  // console.log('titleTag:', titleTag)
  // set the document title element's contents
  titleTag.innerText = 'Firing logger' + titleTxt
  console.groupEnd()

  render(
    html`
    <div class="firing-logger ${uiMode}">
      ${header(state.view, eHandler, route, title)}
      <div class="main-content">
        ${subView}
      </div>
    </div>`,
    domNode
  )

  focuser.applyFocus()
}
