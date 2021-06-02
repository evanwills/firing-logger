import { getDummyAction, nonAction } from '../mainApp/firing-logger.state.mjs'

import { kilnActions } from './kilns.state.actions.mjs'
import { getNewKiln, getTmpKiln, cloneUpdateKiln, isInvalidKilnField } from './kiln-utils.mjs'
import { getItemByID } from '../../utilities/general.mjs'
import { invalidString, invalidObject } from '../../utilities/validation.mjs'

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

    case kilnActions.TMP_COMMIT:
      // Do some validation stuff
      // console.group('kilnsMW()')
      // console.log('action:', action)
      // console.log('_state.studio.kilns.tmp:', _state.studio.kilns,tmp)
      // console.groupEnd()
      const id = (!invalidObject('tmp', _state.studio.kilns) && !invalidString('id', _state.studio.kilns.tmp)) // eslint-disable-line
        ? _state.studio.kilns.tmp.id
        : ''
      store.dispatch({
        ...action,
        type: '',
        href: '/kilns/' + id
      })
      return next(action)

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

    case kilnActions.TMP_UPDATE_CHECKBOX_FIELD:
      // Because checkboxes behave a little differently we need to
      // redo rewrite the action and dispatch it again.
      store.dispatch({
        ...action,
        type: kilnActions.TMP_UPDATE_FIELD,
        payload: {
          ...action.payload,
          id: action.payload.value,
          value: action.payload.isChecked
        }
      })
      return next(nonAction())
  }

  return next(action)
}
