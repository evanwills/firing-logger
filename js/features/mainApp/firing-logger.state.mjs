import {
  combineReducers,
  createStore,
  applyMiddleware,
  compose
} from '../../vendor/redux/redux.mjs'
import {
  logger,
  crashReporter,
  monitorReducerEnhancer
  // readyStatePromise,
  // readyStatePromise,
  // thunk
  // timeoutScheduler,
  // vanillaPromise,
} from '../../vendor/redux/standard-middleware.mjs'
import { kilnReducer } from '../kilns/kilns.reducers.state.mjs'
import { programReducer } from '../firing-programs/programs.reducer.state.mjs'
import { invalidStrNum, invalidBool } from '../../utilities/validation.mjs'
import { getMetaFromID } from '../../utilities/sanitisation.mjs'
// import { persistToLocal } from './persistant.mw.mjs'
import { viewReducer } from './view.state.mjs'

const initialState = {
  studio: {
    kilns: {
      all: [{
        id: 'woodrow1',
        brand: 'Woodrow',
        model: '1',
        name: 'New Woodrow',
        installDate: '2021-04-29T11:24:35+1000',
        energy: 'electric',
        type: 'general',
        maxTemp: 1280,
        width: 500,
        depth: 500,
        height: 500,
        glaze: true,
        bisque: true,
        singleFire: false,
        retired: false,
        isWorking: true,
        isInUse: false,
        isHot: false
      }],
      tmp: {},
      filters: {
        controllerProgramID: -1,
        kilnID: '',
        minCreated: -1,
        maxCreated: -1,
        minDuration: -1,
        maxDuration: -1,
        maxTemp: -1,
        minTemp: -1,
        name: '',
        superseded: 0,
        used: -1
      }
    },
    firingPrograms: {
      all: [{
        id: 'tF3Kq7NJnSVfGs',
        kilnID: 'woodrow1',
        controllerProgramID: 6,
        type: 'bisque',
        name: 'Slow bisque',
        version: 0,
        description: 'Good for firing not quite dry and/or large work',
        maxTemp: 1000,
        duration: 40920,
        steps: [{
          endTemp: 200,
          rate: 50,
          hold: 0
        }, {
          endTemp: 520,
          rate: 100,
          hold: 0
        }, {
          endTemp: 600,
          rate: 60,
          hold: 0
        }, {
          endTemp: 1000,
          rate: 150,
          hold: 10
        }],
        created: '2021-05-06T21:13:34+1000',
        createdBy: 'evanwills',
        superseded: false,
        used: true,
        useCount: 4,
        deleted: false
      }],
      tmp: {},
      filters: {
      }
    },
    firingLogs: {
      all: [],
      filters: {}
    },
    maintenance: {
      all: [],
      filters: {}
    },
    users: {
      all: [{
        id: 'evanwills',
        firstName: 'Evan',
        lastName: 'Wills',
        contact: {
          phone: '0414604641',
          email: 'evan.wills@acu.edu.au'
        },
        created: 1621349154990,
        createdBy: 'evanwills',
        active: true,
        isSuper: true,
        permissions: {
          kiln: {
            create: true,
            update: true,
            delete: true
          },
          program: {
            create: true,
            update: true,
            delete: true
          },
          firings: {
            start: true,
            book: true,
            log: true
          },
          user: {
            create: true,
            read: true,
            update: true,
            delete: true
          },
          maintenance: {
            createIssue: true,
            verifyIssue: true,
            fixIssue: true
          }
        }
      }],
      filters: {}
    },
    diary: {
      all: [],
      filters: {}
    }
  },
  currentUser: 'evanWills',
  reports: [],
  view: {
    url: '',
    route: ['']
  }
}

/**
 * @var store Redux store
 */
export const store = createStore(
  combineReducers({
    studio: combineReducers({
      kilns: kilnReducer,
      firingPrograms: programReducer
    }),
    view: viewReducer
  }),
  initialState,
  compose(
    applyMiddleware(
      crashReporter,
      logger
      // persistToLocal
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
  const { meta, value, isChecked, now, ...data } = e.data[0] // eslint-disable-line

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
  console.log('generalEventHandler()')
  return function (e) {
    e.preventDefault()
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