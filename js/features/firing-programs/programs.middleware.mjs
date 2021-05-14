import { programActions } from './programs.actions.state.mjs'

export const programsMW = store => next => action => {
  const _state = store.getState()

  switch (action.type) {
    case programActions.UPDATE: 
      store.dispatch()
    case programActions.CLONE: 
    case programActions.ADD: 
      next({
        type: programActions.TMP_SET,
        payload: 

      })

  }
}
