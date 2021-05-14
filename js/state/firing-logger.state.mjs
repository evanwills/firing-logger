import {
  combineReducers,
  createStore,
  applyMiddleware,
  compose
} from '../redux/redux.mjs'
import {
  logger,
  crashReporter
  // readyStatePromise,
  // thunk
  // timeoutScheduler,
  // readyStatePromise,
  // vanillaPromise,
} from '../redux/standard-middleware.mjs'
import { kilnReducer } from './kilns/kilns.reducers.state.mjs'
import { programReducer } from '../features/firing-programs/programs.reducer.state.mjs'

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
      logger
    )

  )
  //  && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

/**
 * Get a callback function that can be used as an event handler for
 * the web-worker's onmessage event
 *
 * @param {object} store
 * @returns {void}
 */
export const getWorkerDispatcher = (store) => (e) => {
  const _state = store.getState()
  const { meta, value, isChecked, now, ..._data} = e.data[0]

  store.dispatch({
    type: meta.type,
    payload: {
      id: meta.id,
      value: value,
      isChecked: isChecked
    },
    subType1: meta.extra,
    subType2: meta.suffix,
    now: now,
    user: _state.currentUser
  })
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
