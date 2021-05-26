
import { html } from '../../vendor/lit-html/lit-html.mjs'
import { getNavBar } from '../nav-bar/nav-bar.view.mjs'
// import { store } from '../../features/mainApp/firing-logger.state.mjs'
// import { getLink } from '../../shared-views/navigation.view.mjs'
import {
  isBoolTrue
  // invalidString
} from '../../utilities/validation.mjs'
import { viewActions } from '../mainApp/view.state.mjs'

export const header = (viewState, eHandler, route, title) => {
  console.group('header()')
  const _title = (title !== '')
    ? html`: <span class="page-header__sub-head">${title}</span>`
    : ''
  console.log('viewState:', viewState)
  console.log('eHandler:', eHandler)
  console.log('route:', route)
  console.log('title:', title)
  let navLinks = [{
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
  navLinks = navLinks.map(link => {
    return {
      label: link.label,
      path: '/' + link.path.trim(),
      active: (link.path === route)
    }
  })

  let navClass = 'main-nav main-nav--'
  navClass += (viewState.navOpen) ? 'opened' : 'closed'
  console.groupEnd()
  const btnState = isBoolTrue(viewState.navOpen) ? 'Close' : 'Open'
  const btnClass = isBoolTrue(viewState.navOpen) ? 'opened' : 'closed'
  return html`
    <header class="page-header">
      <h1>Firing logger${_title}</h1>
      ${getNavBar(
        navLinks,
        eHandler,
        '',
        navClass
      )}
      <button id="-${viewActions.TOGGLE_NAV}" class="main-menu__btn main-menu__btn--${btnClass}" @click="${eHandler}"><span class="sr-only">${btnState} menu</span></button>
    </header>
  `
}
