import { programsView } from '../firing-programs/programs.view.mjs'
import { kilnsView } from '../kilns/kilns.view.mjs'
import { logsView } from '../logs/logs.view.mjs'
import { render, html } from '../../vendor/lit-html/lit-html.mjs'
import { store } from '../../features/mainApp/firing-logger.state.mjs'
import { getLink } from '../../shared-views/navigation.view.mjs'
import { invalidString } from '../../utilities/validation.mjs'

export const firingLoggerView = (domNode, eHandler, titleTag) => () => {
  console.group('firingLoggerView()')
  console.log('eHandler:', eHandler)
  const state = store.getState()
  const [route, ...subRoutes] = state.view.route
  const uiMode = 'ui-darkmode'
  const hasTitle = (!invalidString('title', state.view, true))
  const title = (hasTitle === true)
    ? html`: <span class="page-header__sub-head">${state.view.title}</span>`
    : ''
  const titleTxt = (hasTitle === true) ? ': ' + state.view.title : ''

  let subView = ''
  const navLinks = [{
    label: 'Kilns',
    path: 'kilns'
  }, {
    label: 'Firing Programs',
    path: 'programs'
  }, {
    label: 'Firing logs',
    path: 'firingLogs'
  // }, {
  //   label: 'Calendar',
  //   path: 'calendar'
  // }, {
  //   label: 'Maintenance',
  //   path: 'maintenance'
  // }, {
  //   label: 'Users',
  //   path: 'users'
  }]

  switch (route) {
    case 'programs':
      subView = programsView(state.studio.firingPrograms, eHandler, subRoutes)
      break

    case 'kilns':
      subView = kilnsView(state.studio.kilns, eHandler, subRoutes)
      break

    case 'logs':
      subView = logsView(state.studio.logs, subRoutes, eHandler)
      break
  }

  console.log('titleTag:', titleTag)
  titleTag.innerText = 'Firing logger' + titleTxt
  console.groupEnd()

  render(
    html`
    <div class="firing-logger ${uiMode}">
      <header class="page-header">
        <h1>Firing logger${title}</h1>
      </header>
      <div class="main-content">
        <nav class="main-nav item-list item-actions__wrap">
          ${navLinks.map(link => getLink(link.label, '/' + link.path, '', '', eHandler, (route === link.path), 'item-actions__item'))}
        </nav>
        ${subView}
      </div>
    </div>`,
    domNode
  )
}
