import { html } from '../../vendor/lit-html/lit-html.mjs'
// import { programActions } from './programs.state.actions.mjs'
// import { getNavBar } from '../nav-bar/nav-bar.view.mjs'
// import { editlog } from './log-edit.view.mjs'
// import { logActions } from './log.state.actions.mjs'

import { getItemByID, getPropByID } from '../../utilities/general.mjs'
import { isNonEmptyStr } from '../../utilities/validation.mjs'

import { getMainContent } from '../main-content/main-content.view.mjs'
import { getItemList } from '../item-list/item-list.view.mjs'

import { getFilteredLogs } from './log-utils.mjs'
import { logListItem, viewFiringLog, updateFiringLog } from './logs.view.single.mjs'

export const logsView = (logs, programs, kilns, eHandler, routes) => {
  const [route, id, ...subRoutes] = routes // eslint-disable-line
  let error = ''
  const _id = isNonEmptyStr(id) ? id : ''

  // console.group('logsView()')
  // console.log('route:', route)
  // console.log('state:', state)
  // console.log('programs:', programs)
  // console.log('kilns:', kilns)
  // console.log(['add', 'edit', 'copy'].indexOf(route))

  // console.log('filters:', getFilteredPrograms(state.filters))

  // const allAvailable = state.all
  let subView = ''
  // let actionLinks = []

  if (isNonEmptyStr(route) && _id !== '') {
    const log = getItemByID(logs, _id)

    if (log !== false) {
      const view = (route === 'update') ? updateFiringLog : viewFiringLog
      subView = view(
        log,
        getItemByID(programs, log.programID),
        getItemByID(kilns, log.kilnID),
        eHandler
      )
    } else {
      error = html`<p class="error">Could not find firing log matching ID: <code>${_id}</code></p>`
    }
  }

  if (subView === '') {
    const logList = logs.filter(getFilteredLogs(programs, kilns))
    // actionLinks = [{
    //   label: 'Add new program',
    //   path: '/programs/add',
    //   id: '',
    //   action: programActions.ADD
    // }]

    subView = getMainContent(
      html`<h2>All available firing logs</h2>`,
      html`${error}
        ${getItemList(
          logList.map(log => logListItem(
            log.id,
            log.name,
            log.type,
            log.maxTemp,
            log.duration,
            '',
            getPropByID(programs, log.programID),
            getPropByID(kilns, log.kilnID),
            eHandler)
          ),
          '',
          '',
          'content--bleed'
      )}
      `,
      '' // html`${getNavBar(actionLinks, eHandler)}`
    )
  }
  // console.groupEnd()

  return subView
}
