import { kilnReducer } from './kilns/kilns.reducers.state.mjs'
import { createStore, combineReducers, compose, applyMiddleware } from '../redux/redux.mjs'
import { crashReporter, logger } from '../redux/standard-middleware.mjs'
import { programReducer } from '../features/firing-programs/programs.reducer.state.mjs'

const initialState = {
  studio: {
    kilns: [],
    firingPrograms: [],
    firingLogs: [],
    maintenance: [],
    issues: [],
    users: [],
    diary: []
  },
  currentUser: 'evanWills',
  reports: [],
  view: 'login',
  stateSlice: {}
}

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
