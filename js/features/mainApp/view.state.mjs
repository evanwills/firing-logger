import { invalidString, isNonEmptyStr } from '../../utilities/validation.mjs'
import { ucFirst } from '../../utilities/sanitisation.mjs'

export const viewActions = {
  SET_FROM_URL: 'VIEW_SET_FROM_URL',
  SET_FROM_URL_INNER: 'VIEW_SET_FROM_URL_INNER',
  SET: 'VIEW_SET_FROM_ACTION',
  OK: 'OK_TO_RENDER',
  TOGGLE_NAV: 'VIEW_TOGGLE_NAV',
  TOGGLE_SETTINGS: 'VIEW_TOGGLE_SETTINGS'
}

const initialState = {
  url: '',
  route: [],
  title: '',
  navOpen: false,
  settingsOpen: false
}

const getViewState = (path) => {
  const _path = path.replace(/^\/|\/$/g, '')
  const route = _path.split('/')
  // console.group('getViewState()')
  // console.log('_path:', _path)
  // console.log('route:', route)
  // console.groupEnd()

  let title = isNonEmptyStr(route[0]) ? route[0] : ''
  switch (title) {
    case 'programs':
      title = 'Firing programs'
      break

    case 'firingLogs':
      title = 'Firing logs'
      break

    default:
      title = ucFirst(title)
  }

  // console.log('title:', title)
  return {
    url: _path,
    route: route,
    title: title
  }
}

const getViewFromURL = (view, data) => {
  let route = ''

  if (!invalidString('pathname', data, true)) {
    route = data.pathname.replace(/^\//, '')
  }

  if (route === '' && typeof data.searchParams !== 'undefined' && !invalidString('view', data.searchParams, true)) {
    route = data.searchParams.view
  }

  if (route !== '') {
    return getViewState(route)
  }

  return view
}

export const viewReducer = (state = initialState, action) => {
  // console.group('viewReducer()')

  switch (action.type) {
    case viewActions.SET_FROM_URL_INNER:
      // console.groupEnd()
      return {
        ...getViewFromURL(state, action.payload),
        navOpen: false,
        settingsOpen: false
      }

    case viewActions.SET_FROM_URL:
      // We don't want anything to happen from this
      // console.groupEnd()
      return state

    case viewActions.TOGGLE_NAV:
      // Open or close the main navigation
      return {
        ...state,
        navOpen: !state.navOpen
      }

    case viewActions.TOGGLE_SETTINGS:
      // Open or close the main navigation
      return {
        ...state,
        settingsOpen: !state.settingsOpen
      }

    default:
      // console.log('action:', action)
      // console.log('action.href:', action.href)
      if (!invalidString('href', action, true) && action.href !== state.url) {
        // console.groupEnd()
        return {
          ...state,
          ...getViewState(action.href),
          navOpen: false,
          settingsOpen: false
        }
      }
  }

  // console.groupEnd()
  return state
}

export const renderReducer = (state = false, action) => (state === false && action.type === viewActions.OK) ? true : state
