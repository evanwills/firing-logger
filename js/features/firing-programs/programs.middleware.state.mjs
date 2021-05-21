import { programActions } from './programs.actions.state.mjs'
import { getProgramByID, getNewProgram } from './programUtils.mjs'

export const programsMW = store => next => action => {
  const _state = store.getState()
  let program
  console.group('programsMW()')
  console.log('action:', action)
  console.log('_state:', _state)
  console.groupEnd()

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
  }

  return next(action)
}
