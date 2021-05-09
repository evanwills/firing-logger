import { firingLoggerView } from './js/view/firing-logger.view.js'
import { fieldHandler } from './js/utilities/general.js'

if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register(url.path + 'firing-logger.sw.js')
}
if (window.Worker) {
  const stateWorker = new Worker('firing-logger.worker.js');
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
