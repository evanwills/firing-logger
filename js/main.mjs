// * globals Worker */

// import { fieldHandler } from './utilities/general.mjs'
import { getURLobject } from './utilities/url.mjs'
import { firingLoggerView } from './view/firing-logger.view.mjs'
import { store, generalEventHandler } from './state/firing-logger.state.mjs'

if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register(url.path + 'firing-logger.sw.mjs')
}

// if (window.Worker) {
// const stateWorker = new Worker(
//   'firing-logger.worker.js',
//   {
//     // type: 'module',
//     credentials: 'same-origin'
//   }
// )
// const eHandler = fieldHandler(stateWorker.postMessage)
const eHandler = generalEventHandler(store)

// stateWorker.onmessage = (e) => {
//   if (e.data.type === 'url') {
//     // Update location history
//   } else {
//     // Update view
//     firingLoggerView(e.data, eHandler)
//   }
// }
const unsubscribe = store.subscribe((store) => {
  // if (e.data.type === 'url') {
  //   Update location history
  // } else {
  //   Update view
  firingLoggerView(store, eHandler)
  // }
})

// stateWorker.postMessage({
store.dispatch({
  type: 'INITIALISE_URL',
  payload: getURLobject(window.location)
})
// }
