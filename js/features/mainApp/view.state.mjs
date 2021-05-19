import { invalidString } from '../../utilities/validation.mjs'

export const viewActions = {
  SET_FROM_URL: 'VIEW_SET_FROM_URL',
  SET: 'VIEW_SET_FROM_ACTION'
}

const initialState = {
  url: '',
  route: [],
  title: ''
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
    // clean up the rout path by removing any
    // leading and/or trailing slashes
    route = route.replace(/^\/+|\/+$/g, '')

    return {
      url: route,
      route: route.split('/')
    }
  }
  return view
}

export const viewReducer = (state = initialState, action) => {
  console.log('action:', action)

  switch (action.type) {
    case viewActions.SET_FROM_URL:
      return getViewFromURL(state, action.payload)

    default:
      if (typeof action.href !== 'undefined' && action.href !== null && action.href !== state.url) {
        const href = action.href.replace(/^\/|\/$/g, '')
        return {
          url: href,
          route: href.split('/'),
          title: ''
        }
      }
  }

  return state
}
