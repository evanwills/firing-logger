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
import { kilnReducer } from '../kilns/kilns.state.reducers.mjs'
import { kilnsMW } from '../kilns/kilns.state.middleware.mjs'
import { programReducer } from '../firing-programs/programs.state.reducer.mjs'
import { programsMW } from '../firing-programs/programs.state.middleware.mjs'
import {
  invalidStrNum,
  invalidNum,
  invalidBool,
  invalidString,
  isNumeric,
  isObject,
  isStr,
  isScalar
} from '../../utilities/validation.mjs'
import { getMetaFromID } from '../../utilities/sanitisation.mjs'
// import { persistToLocal } from './persistant.mw.mjs'
import { viewReducer, renderReducer } from './view.state.mjs'
import { firingLoggerMW } from './firing-logger.state.middleware.mjs'
import { currentUserReducer, usersReducer } from '../users/users.state.mjs'

const initialState = {
  studio: {
    kilns: {
      all: [{
        id: 'MTYyMjUyODg5OTI2NQ',
        brand: 'Woodrow',
        model: '1',
        name: 'New Woodrow',
        installDate: '2021-04-29T11:24:35+1000',
        fuel: 'electric',
        type: 'general',
        maxTemp: 1280,
        width: 500,
        depth: 500,
        height: 500,
        maxProgramCount: 36,
        bisque: true,
        black: false,
        glaze: true,
        luster: true,
        onglaze: true,
        pit: false,
        raku: false,
        rawGlaze: false,
        saggar: false,
        saltGlaze: false,
        isRetired: false,
        isWorking: true,
        isInUse: false,
        isHot: false,
        useCount: 0
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
        id: 'MTYyMjYzMjY5MDc3OA',
        kilnID: 'MTYyMjUyODg5OTI2NQ',
        controllerProgramID: 6,
        version: 0,
        type: 'bisque',
        name: 'Slow bisque',
        description: 'Good for firing not quite dry and/or large work',
        maxTemp: 1000,
        duration: 40920,
        averageRate: 88,
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
        createdBy: 'MTYyMjUyOTI5MzMwMg',
        superseded: false,
        parentID: '',
        used: true,
        useCount: 4,
        deleted: false,
        locked: false
      }, {
        id: 'MTYyMjYzMjY3MjQ5Mw',
        name: 'Basic earthenware glaze',
        controllerProgramID: 7,
        kilnID: 'MTYyMjUyODg5OTI2NQ',
        type: 'glaze',
        version: 0,
        description: '',
        averageRate: 113.4,
        duration: 38667,
        maxTemp: 1180,
        steps: [{
          id: 1,
          endTemp: 520,
          hold: 0,
          rate: 120
        }, {
          id: 2,
          endTemp: 630,
          hold: 0,
          rate: 55
        }, {
          id: 3,
          endTemp: 1180,
          hold: 20,
          rate: 135
        }],
        used: false,
        useCount: 0,
        created: '2021-06-01T16:35:19+1000',
        createdBy: 'MTYyMjUyOTI5MzMwMg',
        superseded: false,
        deleted: false,
        locked: false
      }],
      tmp: {
      },
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
        id: 'MTYyMjUyOTI5MzMwMg',
        firstName: 'Evan',
        lastName: 'Wills',
        contact: {
          phone: '0414604641',
          email: 'evan.wills@acu.edu.au'
        },
        created: 1621349154990,
        createdBy: 'MTYyMjUyOTI5MzMwMg',
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
    route: ['programs', 'add'],
    title: 'Firing programs',
    url: 'kilns/add',
    navOpen: false,
    settingsOpen: false
  },
  render: false
}
/**
 * @var store Redux store
 */
export const store = createStore(
  combineReducers({
    studio: combineReducers({
      kilns: kilnReducer,
      firingPrograms: programReducer,
      users: usersReducer
    }),
    view: viewReducer,
    render: renderReducer,
    currentUser: currentUserReducer
  }),
  initialState,
  compose(
    applyMiddleware(
      crashReporter,
      logger,
      firingLoggerMW,
      programsMW,
      kilnsMW
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
// const getRout = (meta) => {
// }

export const getDummyPayload = (id, value) => {
  const _id = isStr(id) ? id : ''
  const _value = isScalar(value) ? value : ''
  return {
    id: _id,
    value: _value,
    isChecked: false,
    extra: '',
    suffix: ''
  }
}

export const getDummyAction = (action, type, href, id) => {
  const _action = isObject(action) ? action : {}
  return {
    type: isStr(type) ? type : '',
    payload: getDummyPayload(id),
    href: isStr(href) ? href : '',
    user: !invalidString('user', _action) ? _action.user : '',
    now: !invalidNum('now', _action) ? _action.now : Date.now()
  }
}

export const nonAction = () => {
  return { type: 'void' }
}

export const generalEventHandler = (_store) => {
  console.group('getGeneralEventHandler()')
  console.groupEnd()
  return function (e) {
    e.preventDefault()
    console.group('generalEventHandler()')
    console.log('this:', this)
    const _state = _store.getState()
    const _meta = getMetaFromID(this.id)
    const _val = (!invalidStrNum('value', this)) ? this.value : null
    const output = {
      type: getActionType(_meta),
      payload: {
        id: _meta.id,
        // Convert numeric values into numbers
        value: isNumeric(_val) ? _val * 1 : _val,
        isChecked: (invalidBool('checked', this, true) === false),
        extra: _meta.extra,
        suffix: _meta.suffix
      },
      href: (!invalidString('href', this, true))
        ? this.href.replace(/^(?:(?:https?:)?\/\/[^/]+\/)?/, '')
        : null,
      now: Date.now(),
      user: _state.currentUser
    }
    console.log('_meta:', _meta)
    console.log('output:', output)
    console.groupEnd()
    _store.dispatch(output)
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
