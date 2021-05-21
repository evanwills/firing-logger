import { invalidString, isNonEmptyStr } from '../../utilities/validation.mjs'
import { ucFirst } from '../../utilities/sanitisation.mjs'

export const viewActions = {
  SET_FROM_URL: 'VIEW_SET_FROM_URL',
  SET: 'VIEW_SET_FROM_ACTION'
}

const initialState = {
  url: '',
  route: [],
  title: ''
}

const getViewState = (path) => {
  const _path = path.replace(/^\/|\/$/g, '')
  const route = _path.split('/')

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
  // console.log('action:', action)

  switch (action.type) {
    case viewActions.SET_FROM_URL:
      return getViewFromURL(state, action.payload)

    default:
      if (typeof action.href !== 'undefined' && action.href !== null && action.href !== state.url) {
        return getViewState(action.href)
      }
  }

  return state
}
