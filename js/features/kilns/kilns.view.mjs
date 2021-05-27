import { html } from '../../vendor/lit-html/lit-html.mjs'
import { getItemList } from '../item-list/item-list.view.mjs'
import { getMainContent } from '../main-content/main-content.view.mjs'
import { getNavBar } from '../nav-bar/nav-bar.view.mjs'
import { isNonEmptyStr } from '../../utilities/validation.mjs'
import { kilnActions } from './kilns.state.actions.mjs'
import { kilnListItem, singleKiln, editKiln } from './kiln-single.view.mjs'

const getFilteredKilns = (filters) => (kiln) => true

export const kilnsView = (state, eHandler, routes) => {
  const { route, ...subRoutes } = routes
  console.group('kilnsView()')

  let error = ''
  let subView = ''
  let actionLinks = []

  if (isNonEmptyStr(route)) {
    const kiln = state.all.filter(kiln => kiln.id === route)
    if (kiln.length === 1) {
      subView = singleKiln(kiln[0], eHandler)
    } else if (['add', 'edit', 'copy'].indexOf(route) > -1) {
      // console.log('state:', state)
      // console.log('kilns:', kilns)
      subView = editKiln(state.tmp, '', eHandler)
    } else {
      error = html`<p class="error"></p>Could not find kiln kiln matching ID: <code>${route}</code></p>`
    }
  }

  if (subView === '') {
    const kilns = state.all.filter(getFilteredKilns(state.filters))
    actionLinks = [{
      label: 'Add new kiln',
      path: '/kilns/add',
      id: '',
      action: kilnActions.ADD
    }]

    subView = getMainContent(
      html`<h2>All available kilns</h2>`,
      html`${error}
        ${getItemList(
          kilns.map(kiln => kilnListItem(kiln)),
          '',
          '',
          'content--bleed'
        )}
      `,
      html`${getNavBar(actionLinks, eHandler)}`
    )
  }

  console.log('route:', route)
  console.log('subRoutes:', subRoutes)
  console.groupEnd()

  return subView
}
