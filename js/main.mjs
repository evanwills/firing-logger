// * globals Worker */

// import { fieldHandler } from './utilities/general.mjs'
import { getURLobject } from './utilities/url.mjs'
import { store, generalEventHandler } from './features/mainApp/firing-logger.state.mjs'
import { viewActions } from './features/mainApp/view.state.mjs'
import { firingLoggerView } from './features/mainApp/firing-logger.view.mjs'
import { updateHistory } from './history.mjs'

if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register(url.path + 'firing-logger.sw.mjs')
}

const eHandler = generalEventHandler(store)
const titleTag = document.getElementById('pageTitle')

const unsubscribe = {
  view: store.subscribe(firingLoggerView(document.body, eHandler, titleTag)),
  history: store.subscribe(updateHistory)
}

store.dispatch({ type: 'GET_LOCAL_DATA' })

// stateWorker.postMessage({
store.dispatch({
  type: viewActions.SET_FROM_URL,
  payload: getURLobject(window.location)
})
// }

window.onpopstate = function (e) {
  // const state = store.getState()
  // const lastPath = state.view.route
  console.log('e:', e)
  store.dispatch({
    type: viewActions.SET_FROM_URL,
    payload: getURLobject(window.location)
  })
}
window.addEventListener('hashchange', function (e) {
  console.group('hashchange event triggered')
  console.log(getURLobject(window.location))
  console.groupEnd()
})
