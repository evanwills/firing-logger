import { html } from '../../vendor/lit-html/lit-html.mjs'
import { programListItem, singleProgram } from './program.view.mjs'
// import { programActions } from './programs.state.actions.mjs'
import { getFilteredLogs, getKilnName } from './log-utils.mjs'
import { getNavBar } from '../nav-bar/nav-bar.view.mjs'
import { editlog } from './log-edit.view.mjs'
import { logActions } from './log.state.actions.mjs'
import { isNonEmptyStr } from '../../utilities/validation.mjs'
import { getMainContent } from '../main-content/main-content.view.mjs'
import { getItemList } from '../item-list/item-list.view.mjs'

export const logsView = (logs, programs, kilns, eHandler, routes) => {
  const [route, ...subRoutes] = routes // eslint-disable-line
  let error = ''

  // console.group('logsView()')
  // console.log('route:', route)
  // console.log('state:', state)
  // console.log('programs:', programs)
  // console.log('kilns:', kilns)
  // console.log(['add', 'edit', 'copy'].indexOf(route))

  // console.log('filters:', getFilteredPrograms(state.filters))

  // const allAvailable = state.all
  let subView = ''
  let actionLinks = []

  if (isNonEmptyStr(route)) {
    switch (route) {
      case 'new':
      case 'update':
      case
    }
    const logs = state.all.filter(log => log.id === route)
    if (logs.length === 1) {
      subView = singleLog(logs[0], getKilnName(prog[0].kilnID, kilns), eHandler)
    } else if (['new', 'update'].indexOf(route) > -1) {
      // console.log('state:', state)
      // console.log('kilns:', kilns)
      subView = editLog(state.tmp, kilns, '', eHandler)
    } else {
      error = html`<p class="error"></p>Could not find firing log matching ID: <code>${route}</code></p>`
    }
  }

  if (subView === '') {
    const programs = state.all.filter(getFilteredPrograms(state.filters))
    actionLinks = [{
      label: 'Add new program',
      path: '/programs/add',
      id: '',
      action: programActions.ADD
    }]

    subView = getMainContent(
      html`<h2>All available programs</h2>`,
      html`${error}
        ${getItemList(
          programs.map(program => programListItem(program.id, program.name, program.type, program.maxTemp, program.duration, '', program.isUsed, getKilnName(program.kilnID, kilns), eHandler)),
          '',
          '',
          'content--bleed'
      )}
      `,
      html`${getNavBar(actionLinks, eHandler)}`
    )
  }
  // console.groupEnd()

  return subView
}
