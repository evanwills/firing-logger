import { kilnActions } from '../kilns/kilns.state.actions.mjs'
import { programActions } from '../firing-programs/programs.state.actions.mjs'
import { viewActions } from './view.state.mjs'
import { getDummyAction } from './firing-logger.state.mjs'
import { logActions } from '../logs/logs.state.actions.mjs'
import { invalidString, isNonEmptyStr } from '../../utilities/validation.mjs'
import { userActions } from '../users/users.state.mjs'
import { diaryActions } from '../diary/dirary.state.actions.mjs'

export const firingLoggerMW = store => next => action => {
  let state = null
  // console.group('firingLoggerMW()')
  // console.log('action:', action)
  switch (action.type) {
    case viewActions.SET_FROM_URL:
      store.dispatch({ ...action, type: viewActions.SET_FROM_URL_INNER })

      state = store.getState()

      const [top, mode, id] = state.view.route // eslint-disable-line

      // console.log('state.view:', state.view)
      // console.log('top:', top)
      // console.log('mode:', mode)
      // console.log('id:', id)
      let actions = null // eslint-disable-line

      switch (top) {
        case 'programs':
          actions = programActions
          break
        case 'kilns':
          actions = kilnActions
          break
        case 'firingLogs':
          actions = logActions
          break
        case 'users':
          actions = userActions
          break
        case 'diary':
          actions = diaryActions
          break
      }

      // console.log('actions:', actions)
      if (actions !== null && isNonEmptyStr(mode)) {
        const MODE = (mode === 'edit')
          ? 'UPDATE'
          : (mode === 'copy') ? 'CLONE' : mode.toUpperCase()

        // console.log('MODE:', MODE)
        // console.log('actions[' + MODE + ']:', actions[MODE])

        if (!invalidString(MODE, actions)) {
          // console.groupEnd()
          return next(getDummyAction({}, actions[MODE], '', id))
        }
      }

      // console.groupEnd()
      return next({ type: 'void' })

    default:
      // console.groupEnd()
      return next(action)
  }
}
