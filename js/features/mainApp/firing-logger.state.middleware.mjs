import { programActions } from '../firing-programs/programs.state.actions.mjs'
import { viewActions } from './view.state.mjs'

export const firingLoggerMW = store => next => action => {
  let state = null
  // console.group('firingLoggerMW()')
  // console.log('action:', action)
  switch (action.type) {
    case viewActions.SET_FROM_URL:
      store.dispatch({ ...action, type: viewActions.SET_FROM_URL_INNER })

      state = store.getState()

      // console.log('state.view:', state.view)
      switch (state.view.url) {
        case 'programs/add':
          return next({ type: programActions.ADD })

        default:
          return next({ type: 'void' })
      }
      // console.groupEnd()
      // return next(action)

    default:
      // console.groupEnd()
      return next(action)
  }
}
