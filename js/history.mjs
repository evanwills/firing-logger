import { store } from './features/mainApp/firing-logger.state.mjs'

let currentHref = ''

export const updateHistory = () => {
  const state = store.getState()

  if (state.view.url !== currentHref) {
    currentHref = state.view.url
    window.history.pushState({}, '', '/' + currentHref)
  }
}
