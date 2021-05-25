import { invalidString, isNonEmptyStr } from '../../utilities/validation.mjs'
import { ucFirst } from '../../utilities/sanitisation.mjs'

export const viewActions = {
  SET_FROM_URL: 'VIEW_SET_FROM_URL',
  SET_FROM_URL_INNER: 'VIEW_SET_FROM_URL_INNER',
  SET: 'VIEW_SET_FROM_ACTION',
  OK: 'OK_TO_RENDER'
}

const initialState = {
  url: '',
  route: [],
  title: ''
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
      return getViewFromURL(state, action.payload)

    case viewActions.SET_FROM_URL:
      // We don't want anything to happen from this
      // console.groupEnd()
      return state

    default:
      // console.log('action:', action)
      // console.log('action.href:', action.href)
      if (!invalidString('href', action) && action.href !== state.url) {
        // console.groupEnd()
        return getViewState(action.href)
      }
  }

  // console.groupEnd()
  return state
}

export const renderReducer = (state = false, action) => (state === false && action.type === viewActions.OK) ? true : state
