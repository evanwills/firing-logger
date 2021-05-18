// * globals Worker */

// import { fieldHandler } from './utilities/general.mjs'
import { getURLobject } from './utilities/url.mjs'
import { store, generalEventHandler } from './features/mainApp/firing-logger.state.mjs'
import { viewActions } from './features/mainApp/view.state.mjs'
import { firingLoggerView } from './features/mainApp/firing-logger.view.mjs'

if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register(url.path + 'firing-logger.sw.mjs')
}

const eHandler = generalEventHandler(store)

const unsubscribe = store.subscribe(
  firingLoggerView(document.body, eHandler)
)

store.dispatch({ type: 'GET_LOCAL_DATA' })

// stateWorker.postMessage({
store.dispatch({
  type: viewActions.SET_FROM_URL,
  payload: getURLobject(window.location)
})
// }
