import { programActions } from './programs.state.actions.mjs'
import { getProgramByID, getNewProgram, isInvalidProgramField } from './programUtils.mjs'

export const programsMW = store => next => action => {
  const _state = store.getState()
  let program
  // console.group('programsMW()')
  // console.log('action:', action)
  // console.log('_state:', _state)
  // console.groupEnd()

  switch (action.type) {
    case programActions.UPDATE:
      program = getProgramByID(_state.studio.firingPrograms.all, action.payload.id)
      if (program !== false) {
        return next({
          ...action,
          type: programActions.TMP_SET,
          payload: {
            ...action.payload,
            value: {
              ...program,
              mode: programActions.UPDATE
            }
          }
        })
      } else {
        // report some error
      }
      break

    case programActions.CLONE:
      program = getProgramByID(_state.studio.firingPrograms.all, action.payload.id)
      if (program !== false) {
        return next({
          ...action,
          type: programActions.TMP_SET,
          payload: {
            ...action.payload,
            value: {
              ...program,
              mode: programActions.CLONE
            }
          }
        })
      } else {
        // report some error
      }
      break

    case programActions.ADD:
      return next({
        ...action,
        type: programActions.TMP_SET,
        payload: {
          ...action.payload,
          value: {
            ...getNewProgram(),
            mode: programActions.ADD
          }
        }
      })
      // break

    case programActions.TMP_UPDATE_STEP:
      store.dispatch({
        ...action,
        type: programActions.TMP_UPDATE_STEP_INNER
      })
      return next({
        ...action,
        type: programActions.TMP_UPDATE_STEP_INFERRED
      })
      // break

    case programActions.TMP_UPDATE_FIELD:
      const tmp = isInvalidProgramField( // eslint-disable-line
        action,
        _state.studio.firingPrograms.tmp,
        _state.studio.firingPrograms.all,
        _state.studio.kilns.all
      )

      if (tmp === false) {
        return next(action)
      } else {
        console.error(
          programActions.TMP_UPDATE_FIELD_ERROR,
          tmp,
          action
        )
        return next({
          ...action,
          type: programActions.TMP_UPDATE_FIELD_ERROR,
          payload: {
            ...action.payload,
            value: tmp
          }
        })
      }
  }

  return next(action)
}
