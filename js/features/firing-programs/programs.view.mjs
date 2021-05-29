import { html } from '../../vendor/lit-html/lit-html.mjs'
import { programListItem, singleProgram } from './program-single.view.mjs'
// import { programActions } from './programs.state.actions.mjs'
import { getFilteredPrograms, getKilnName } from './program-utils.mjs'
import { getNavBar } from '../nav-bar/nav-bar.view.mjs'
import { editProgram } from './program-edit.view.mjs'
import { programActions } from './programs.state.actions.mjs'
import { isNonEmptyStr } from '../../utilities/validation.mjs'
import { getMainContent } from '../main-content/main-content.view.mjs'
import { getItemList } from '../item-list/item-list.view.mjs'
import { getItemsByID } from '../../utilities/general.mjs'
import { lcFirst } from '../../utilities/sanitisation.mjs'

const getFieldName = (prop) => {
  const props = {
    kilnID: 'Kiln ID',
    controllerProgramID: 'Program No.',
    type: 'Firing type',
    version: 'Version',
    maxTemp: 'Max temp',
    duration: 'Total firing time',
    averageRate: 'Average rate',
    created: 'Created',
    createdBy: 'Created by',
    superseded: 'Superseded',
    used: 'Used',
    useCount: 'Usage count'
  }

  console.group('programsView()')
  console.log('prop:', prop)
  console.log('props:', props)
  console.log('isNonEmptyStr(' + prop + ', props):', isNonEmptyStr(prop, props))
  console.log('props[' + prop + ']:', props[prop])
  console.groupEnd()

  return (isNonEmptyStr(prop, props)) ? props[prop] : ''
}

export const programsView = (state, kilns, eHandler, routes) => {
  const [route, ...subRoutes] = routes // eslint-disable-line
  let error = ''

  console.group('programsView()')
  console.log('route:', route)
  console.log('subRoutes:', subRoutes)
  console.log('state:', state)
  console.log('kilns:', kilns)
  // console.log(['add', 'edit', 'copy'].indexOf(route))

  // console.log('filters:', getFilteredPrograms(state.filters))

  // const allAvailable = state.all
  let subView = ''
  let actionLinks = []

  if (isNonEmptyStr(route)) {
    const prog = state.all.filter(program => program.id === route)
    if (prog.length === 1) {
      subView = singleProgram(prog[0], getKilnName(prog[0].kilnID, kilns), eHandler)
    } else if (['add', 'edit', 'copy'].indexOf(route) > -1) {
      // console.log('state:', state)
      // console.log('kilns:', kilns)
      subView = editProgram(state.tmp, kilns, '', eHandler)
    } else if (route.substr(0, 2) === 'by') {
      const field = lcFirst(route.substr(2))
      const filterValue = isNonEmptyStr(subRoutes[0]) ? subRoutes[0] : ''
      const filteredPrograms = getItemsByID(state.all, filterValue, field)
      const humanFieldName = getFieldName(field)
      console.log('field:', field)
      console.log('filterValue:', filterValue)
      console.log('filteredPrograms:', filteredPrograms)
      console.log('humanFieldName:', humanFieldName)

      let humanFilterValue = ''
      switch (field) {
        case 'kilnID':
          humanFilterValue = getKilnName(filterValue, kilns)
          break

        default:
          humanFilterValue = filterValue
      }
      console.log('humanFilterValue:', humanFilterValue)

      if (filteredPrograms.length > 0) {
        subView = getMainContent(
          html`<h2>All programs for ${humanFieldName}: ${humanFilterValue}</h2>`,
          html`${error}
          ${getItemList(
            filteredPrograms.map(program => programListItem(
              program.id,
              program.name,
              program.type,
              program.maxTemp,
              program.duration,
              '',
              program.isUsed,
              getKilnName(program.kilnID, kilns), eHandler)
            ),
            '',
            '',
            'content--bleed'
            )}
          `,
          html`${getNavBar(actionLinks, eHandler)}`
        )
      } else {
        error = html`<p class="error"></p>Could not find firing program matching ${humanFieldName}: <code>${humanFilterValue}</code></p>`
      }
    } else {
      error = html`<p class="error"></p>Could not find firing program matching ID: <code>${route}</code></p>`
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
  console.groupEnd()

  return subView
}
