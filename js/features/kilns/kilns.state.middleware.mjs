import { getDummyAction, nonAction } from '../mainApp/firing-logger.state.mjs'

import { kilnActions } from './kilns.state.actions.mjs'
import { getNewKiln, getTmpKiln, cloneUpdateKiln, isInvalidKilnField } from './kiln-utils.mjs'
import { getItemByID } from '../../utilities/general.mjs'

export const kilnsMW = store => next => action => {
  let _state = store.getState()
  let kiln
  let tmp

  switch (action.type) {
    case kilnActions.ADD:
      store.dispatch({
        ...action,
        type: kilnActions.TMP_SET,
        payload: {
          ...action.payload,
          value: getTmpKiln(getNewKiln(), kilnActions.ADD)
        }
      })
      return next(getDummyAction())

    case kilnActions.UPDATE:
      // console.group('kilnsMW()')
      // console.log('action.type:', action.type)
      kiln = getItemByID(_state.studio.kilns.all, action.payload.id)
      // console.log('kiln:', kiln)

      if (kiln !== false) {
        store.dispatch({
          ...action,
          type: kilnActions.TMP_SET,
          payload: {
            ...action.payload,
            value: getTmpKiln(cloneUpdateKiln(kiln, false, action.now), kilnActions.UPDATE)
          }
        })
        // console.groupEnd()
        return next(nonAction())
      }
      break

    case kilnActions.CLONE:
      kiln = getItemByID(_state.studio.kilns.all, action.payload.id)
      if (kiln !== false) {
        store.dispatch({
          ...action,
          type: kilnActions.TMP_SET,
          payload: {
            ...action.payload,
            value: getTmpKiln(cloneUpdateKiln(kiln, true, action.now), kilnActions.CLONE)
          }
        })
        return next(nonAction())
      }
      break

    case kilnActions.TMP_UPDATE_FIELD:
      tmp = isInvalidKilnField(
        action,
        _state.studio.kilns.tmp,
        _state.studio.kilns.all
      )

      if (tmp === false) {
        return next(action)
      } else {
        console.error(
          kilnActions.TMP_UPDATE_FIELD_ERROR,
          tmp,
          action
        )
        return next({
          ...action,
          type: kilnActions.TMP_UPDATE_FIELD_ERROR,
          payload: {
            ...action.payload,
            value: tmp
          }
        })
      }
  }

  return next(action)
}
