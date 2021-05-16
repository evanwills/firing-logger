/* globals Worker */

import { fieldHandler } from './utilities/general.mjs'
import { getURLobject } from './utilities/url.mjs'
import { firingLoggerView } from './view/firing-logger.view.mjs'

if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register(url.path + 'firing-logger.sw.js')
}

if (window.Worker) {
  const stateWorker = new Worker('firing-logger.worker.js')
  const eHandler = fieldHandler(stateWorker.postMessage)

  stateWorker.onmessage = (e) => {
    if (e.data.type === 'url') {
      // Update location history
    } else {
      // Update view
      firingLoggerView(e.data, eHandler)
    }
  }

  stateWorker.postMessage({
    metadata: {
      type: 'INITIALISE_URL'
    },
    value: getURLobject(window.location)
  })
}
