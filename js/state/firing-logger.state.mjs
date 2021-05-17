import {
  combineReducers,
  createStore,
  applyMiddleware,
  compose
} from '../vendor/redux/redux.mjs'
import {
  logger,
  crashReporter,
  monitorReducerEnhancer
  // readyStatePromise,
  // readyStatePromise,
  // thunk
  // timeoutScheduler,
  // vanillaPromise,
} from '../vendor/redux/standard-middleware.mjs'
import { kilnReducer } from '../features/kilns/kilns.reducers.state.mjs'
import { programReducer } from '../features/firing-programs/programs.reducer.state.mjs'
import { invalidStrNum, invalidBool } from '../utilities/validation.mjs'
import { getMetaFromID } from '../utilities/sanitisation.mjs'
import { persistToLocal } from './persistant.mw.mjs'

const initialState = {
  studio: {
    kilns: {
      all: [],
      tmp: {}
    },
    firingPrograms: {
      all: [],
      tmp: {}
    },
    firingLogs: [],
    maintenance: [],
    issues: [],
    users: [],
    diary: []
  },
  currentUser: 'evanWills',
  reports: [],
  view: 'login',
  url: {
    hash: '',
    host: '',
    hostname: '',
    href: '',
    actionHref: '',
    origin: '',
    password: '',
    path: '',
    pathname: '',
    port: '',
    protocol: '',
    search: '',
    searchParams: {},
    searchParamsRaw: {},
    username: ''
  },
  stateSlice: {}
}

/**
 * @var store Redux store
 */
export const store = createStore(
  combineReducers({
    studio: combineReducers({
      kilns: kilnReducer,
      firingPrograms: programReducer
    })
  }),
  initialState,
  compose(
    applyMiddleware(
      crashReporter,
      logger,
      persistToLocal
    ),
    monitorReducerEnhancer

  )
  // && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

/**
 * Get Redux action type based on metadata from event
 *
 * @param {object} meta Metadata extracted from event emitter's ID
 *                      attribute
 *
 * @returns {string} Action type that can be recognised by redux
 *                   reducers and middleware
 */
const getActionType = (meta) => {
  // This will need to be built upon as more features are added to
  // the app

  return meta.type
}

/**
 * Get a callback function that can be used as an event handler for
 * the web-worker's onmessage event
 *
 * @param {object} store
 * @returns {void}
 */
export const getWorkerDispatcher = (_store) => (e) => {
  const _state = _store.getState()
  const { meta, value, isChecked, now, ...data } = e.data[0]

  _store.dispatch({
    type: getActionType(meta),
    payload: {
      id: meta.id,
      value: value,
      isChecked: isChecked
    },
    now: now,
    user: _state.currentUser
  })
}

export const generalEventHandler = (_store) => {
  return function (e) {
    console.log('inside generalEventHandler()')
    const _state = _store.getState()
    const _meta = getMetaFromID(this.id)

    _store.dispatch({
      type: getActionType(_meta),
      payload: {
        id: _meta.id,
        value: (invalidStrNum('val', this)) ? null : this.value,
        isChecked: (invalidBool('checked', this, true) === false)
      },
      now: Date.now(),
      user: _state.currentUser
    })
  }
}

/**
 * Get a callback function to push data to the main thread when the
 * Redux store has been updated
 *
 * @param {function} postMessage Web Worker postMessage() function to
 *                               send data back to the main thread
 * @param {function} getState    Redux store's getState() function
 *
 * @returns {function} A callback function that pushes data to the
 *                     main thread and can be used as a subscriber
 *                     for the redux store
 */
export const getWorkerPoster = (postMessage, getState) => () => {
  const _state = getState()

  postMessage({
    type: 'view',
    // TODO: Work out what bits of the state are needed by the
    //       current view and send only those bits
    payload: _state
  })

  // Send the URL just in case it's changed
  postMessage({
    type: 'url',
    payload: _state.url.pathnme + _state.url.search
  })
}
