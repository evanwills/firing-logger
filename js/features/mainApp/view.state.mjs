import { invalidString } from '../../utilities/validation.mjs'

export const viewActions = {
  SET_FROM_URL: 'VIEW_SET_FROM_URL',
  SET_FROM_ACTION: 'VIEW_SET_FROM_ACTION'
}

const initialState = {
  url: '',
  route: []
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

    case viewActions.SET_FROM_ACTION:
      if (!invalidString('value', action.payload)) {
        return action.payload.value
      }
  }

  return state
}
