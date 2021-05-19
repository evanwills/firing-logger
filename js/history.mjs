import { store } from './features/mainApp/firing-logger.state.mjs'
import { isNonEmptyStr } from './utilities/validation.mjs'

let currentHref = ''

export const updateHistory = () => {
  const state = store.getState()

  if (state.view.url !== currentHref) {
    currentHref = state.view.url

    let title = 'Firing logger'
    if (isNonEmptyStr(state.view.title)) {
      title += ': ' + state.view.title
    }

    window.history.pushState({}, title, '/' + currentHref)
  }
}
