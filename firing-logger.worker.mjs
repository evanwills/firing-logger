/* globals onmessage, postMessage */

import { store, getWorkerDispatcher, getWorkerPoster } from './js/state/firing-logger.state.mjs'

onmessage = getWorkerDispatcher(store)

const unsubscribe = store.subscribe({
  main: getWorkerPoster(postMessage, store.getState)
})
